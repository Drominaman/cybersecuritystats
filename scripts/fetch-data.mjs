#!/usr/bin/env node
/**
 * Pre-build script: fetches all stats from Supabase and saves to static JSON.
 * Run before `next build` so pages read from local files, not live API.
 */
import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'src', 'data', 'generated')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchAllStats() {
  const PAGE_SIZE = 1000
  let all = []
  let offset = 0

  while (true) {
    const { data, error } = await supabase
      .from('cyberstats_rss')
      .select('title,link,publisher,source_name,published_on,created_at,tag1,tag2,tag3,tag4,tag5')
      .order('published_on', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) {
      console.error('Supabase error:', error.message)
      process.exit(1)
    }

    all = all.concat(data)
    console.log(`  Fetched ${all.length} stats...`)

    if (data.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  return all
}

async function fetchBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      'slug,title,excerpt,content,author,author_url,post_type,tags,stat_count,featured,meta_description,published_at,updated_at'
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error.message)
    process.exit(1)
  }

  return data
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

/**
 * The feed carries the same publisher under several spellings — "CrowdStrike",
 * "CROWDSTRIKE", "Crowdstrike", "IBM " with a trailing space. They all slugify
 * to one URL, so leaving them split strands stats on the wrong publisher page
 * and 404s report pages whose publisher variant lost the lookup. Collapse each
 * slug to a single spelling before anything downstream groups by publisher.
 */
function normalizePublishers(stats) {
  const variants = new Map()
  for (const stat of stats) {
    if (!stat.publisher) continue
    const name = stat.publisher.trim()
    if (!name) continue
    const slug = slugify(name)
    if (!slug) continue
    if (!variants.has(slug)) variants.set(slug, new Map())
    const counts = variants.get(slug)
    counts.set(name, (counts.get(name) || 0) + 1)
  }

  // Prefer a spelling that uses mixed case over SHOUTING or all lowercase;
  // break ties on how often the spelling appears.
  const casingRank = (name) =>
    name !== name.toUpperCase() && name !== name.toLowerCase() ? 2 : name === name.toLowerCase() ? 1 : 0

  const canonical = new Map()
  let merged = 0
  for (const [slug, counts] of variants) {
    const best = [...counts.entries()].sort(
      (a, b) => casingRank(b[0]) - casingRank(a[0]) || b[1] - a[1]
    )[0][0]
    canonical.set(slug, best)
    if (counts.size > 1) merged++
  }

  for (const stat of stats) {
    if (!stat.publisher) continue
    const slug = slugify(stat.publisher.trim())
    const best = canonical.get(slug)
    if (best) stat.publisher = best
  }

  return merged
}

/**
 * Report titles have the same problem as publisher names: "Fastly Threat
 * Insights Report" and "Fastly Threat Insights Report " are one report, but
 * being distinct strings they split into two. Both slugify to one URL, so the
 * report page shows whichever spelling the lookup happened to find and the
 * statistics filed under the other are unreachable.
 */
function normalizeReportNames(stats) {
  const variants = new Map()
  for (const stat of stats) {
    if (!stat.publisher || !stat.source_name) continue
    const name = stat.source_name.trim()
    if (!name) continue
    const key = `${slugify(stat.publisher)}|${slugify(name)}`
    if (!variants.has(key)) variants.set(key, new Map())
    const counts = variants.get(key)
    counts.set(name, (counts.get(name) || 0) + 1)
  }

  const canonical = new Map()
  let merged = 0
  for (const [key, counts] of variants) {
    const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
    canonical.set(key, best)
    if (counts.size > 1) merged++
  }

  for (const stat of stats) {
    if (!stat.publisher || !stat.source_name) continue
    const key = `${slugify(stat.publisher)}|${slugify(stat.source_name.trim())}`
    const best = canonical.get(key)
    if (best) stat.source_name = best
  }

  return merged
}

/**
 * A handful of rows carry a mistyped year — "52025-05-05", "2926-01-30". Since
 * everything is ordered by published_on, those sort above every real statistic:
 * they take the top of every list and set the "Updated" date on the homepage.
 *
 * The statistic itself is still fine, so keep it and drop only the date we know
 * is wrong. Guessing the intended year would put an unciteable date next to a
 * sourced figure, which is worse than showing none.
 */
function dropImplausibleDates(stats) {
  const thisYear = new Date().getFullYear()
  const suspect = []

  for (const stat of stats) {
    if (!stat.published_on) continue
    const year = Number(String(stat.published_on).slice(0, 4))
    if (!Number.isFinite(year) || year < 1990 || year > thisYear + 1) {
      suspect.push(`${stat.publisher || 'unknown'}: ${stat.published_on}`)
      stat.published_on = null
    }
  }

  return suspect
}

async function main() {
  console.log('Fetching all stats from Supabase...')
  const stats = await fetchAllStats()
  console.log(`Total: ${stats.length} stats`)

  const merged = normalizePublishers(stats)
  console.log(`Normalized publisher names (${merged} had multiple spellings)`)

  const mergedReports = normalizeReportNames(stats)
  console.log(`Normalized report titles (${mergedReports} had multiple spellings)`)

  const badDates = dropImplausibleDates(stats)
  if (badDates.length) {
    console.log(`Dropped ${badDates.length} mistyped publication dates (fix these at source):`)
    for (const entry of [...new Set(badDates)]) console.log(`  ${entry}`)
  }

  mkdirSync(OUT_DIR, { recursive: true })

  // 1. Save raw stats
  writeFileSync(join(OUT_DIR, 'stats.json'), JSON.stringify(stats))
  console.log('Wrote stats.json')

  // 2. Build publisher index
  const publisherMap = new Map()
  for (const stat of stats) {
    if (!stat.publisher) continue
    if (!publisherMap.has(stat.publisher)) {
      publisherMap.set(stat.publisher, { publisher: stat.publisher, count: 0 })
    }
    publisherMap.get(stat.publisher).count++
  }
  const publishers = [...publisherMap.values()].sort((a, b) => b.count - a.count)
  writeFileSync(join(OUT_DIR, 'publishers.json'), JSON.stringify(publishers))
  console.log(`Wrote publishers.json (${publishers.length} publishers)`)

  // 3. Build report index
  const reportMap = new Map()
  for (const stat of stats) {
    if (!stat.publisher || !stat.source_name) continue
    const key = `${stat.publisher}|||${stat.source_name}`
    if (!reportMap.has(key)) {
      reportMap.set(key, { publisher: stat.publisher, source_name: stat.source_name, count: 0 })
    }
    reportMap.get(key).count++
  }
  const reports = [...reportMap.values()].sort((a, b) => b.count - a.count)
  writeFileSync(join(OUT_DIR, 'reports.json'), JSON.stringify(reports))
  console.log(`Wrote reports.json (${reports.length} reports)`)

  // 4. Save published blog posts
  const posts = await fetchBlogPosts()
  writeFileSync(join(OUT_DIR, 'blog.json'), JSON.stringify(posts))
  console.log(`Wrote blog.json (${posts.length} published posts)`)

  // 5. Count unique source_names
  const uniqueReports = new Set(stats.map(s => s.source_name).filter(Boolean))
  writeFileSync(join(OUT_DIR, 'meta.json'), JSON.stringify({
    totalStats: stats.length,
    uniqueReports: uniqueReports.size,
    publisherCount: publishers.length,
    fetchedAt: new Date().toISOString(),
  }))
  console.log(`Wrote meta.json`)

  console.log('Done!')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
