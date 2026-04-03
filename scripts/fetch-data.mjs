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

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function main() {
  console.log('Fetching all stats from Supabase...')
  const stats = await fetchAllStats()
  console.log(`Total: ${stats.length} stats`)

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

  // 4. Count unique source_names
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
