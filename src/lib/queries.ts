import { supabase } from './supabase'
import { INDUSTRY_NORMALIZE, THREAT_NORMALIZE } from '@/data/tag-normalize'
import type { Stat } from '@/types'

function getTagsForNormalized(normalize: Record<string, string>, canonical: string): string[] {
  return Object.entries(normalize)
    .filter(([, v]) => v === canonical)
    .map(([k]) => k)
}

function buildTagFilter(tags: string[]): string {
  const conditions: string[] = []
  for (const tag of tags) {
    for (let i = 1; i <= 5; i++) {
      conditions.push(`tag${i}.ilike.%${tag}%`)
    }
  }
  return conditions.join(',')
}

export async function getStatsForIndustryAndThreat(
  industry: string,
  threat: string
): Promise<Stat[]> {
  const industryTags = getTagsForNormalized(INDUSTRY_NORMALIZE, industry)
  const threatTags = getTagsForNormalized(THREAT_NORMALIZE, threat)

  if (industryTags.length === 0 || threatTags.length === 0) return []

  // Fetch stats matching industry tags
  const industryFilter = buildTagFilter(industryTags)
  const { data: industryStats } = await supabase
    .from('cyberstats_rss')
    .select('title,link,publisher,source_name,published_on,created_at,tag1,tag2,tag3,tag4,tag5')
    .or(industryFilter)
    .order('published_on', { ascending: false })
    .limit(500)

  if (!industryStats) return []

  // Filter client-side for those also matching threat tags
  return industryStats.filter((stat) => {
    const statTags = [stat.tag1, stat.tag2, stat.tag3, stat.tag4, stat.tag5]
      .filter(Boolean)
      .map((t) => (t as string).toLowerCase())

    return threatTags.some((tt) =>
      statTags.some((st) => st.includes(tt.toLowerCase()))
    )
  })
}

export async function getStatsForIndustry(industry: string): Promise<Stat[]> {
  const industryTags = getTagsForNormalized(INDUSTRY_NORMALIZE, industry)
  if (industryTags.length === 0) return []

  const filter = buildTagFilter(industryTags)
  const { data } = await supabase
    .from('cyberstats_rss')
    .select('title,link,publisher,source_name,published_on,created_at,tag1,tag2,tag3,tag4,tag5')
    .or(filter)
    .order('published_on', { ascending: false })
    .limit(1000)

  return data ?? []
}

export async function getStatsForThreat(threat: string): Promise<Stat[]> {
  const threatTags = getTagsForNormalized(THREAT_NORMALIZE, threat)
  if (threatTags.length === 0) return []

  const filter = buildTagFilter(threatTags)
  const { data } = await supabase
    .from('cyberstats_rss')
    .select('title,link,publisher,source_name,published_on,created_at,tag1,tag2,tag3,tag4,tag5')
    .or(filter)
    .order('published_on', { ascending: false })
    .limit(1000)

  return data ?? []
}

export async function getStatsForPublisher(publisher: string): Promise<Stat[]> {
  const { data } = await supabase
    .from('cyberstats_rss')
    .select('title,link,publisher,source_name,published_on,created_at,tag1,tag2,tag3,tag4,tag5')
    .eq('publisher', publisher)
    .order('published_on', { ascending: false })
    .limit(500)

  return data ?? []
}

export async function getStatsForReport(
  publisher: string,
  sourceName: string
): Promise<Stat[]> {
  const { data } = await supabase
    .from('cyberstats_rss')
    .select('title,link,publisher,source_name,published_on,created_at,tag1,tag2,tag3,tag4,tag5')
    .eq('publisher', publisher)
    .eq('source_name', sourceName)
    .order('published_on', { ascending: false })

  return data ?? []
}

export async function getAllPublishers(): Promise<{ publisher: string; count: number }[]> {
  const { data } = await supabase
    .from('cyberstats_rss')
    .select('publisher')

  if (!data) return []

  const counts = new Map<string, number>()
  for (const row of data) {
    if (row.publisher) {
      counts.set(row.publisher, (counts.get(row.publisher) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .map(([publisher, count]) => ({ publisher, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getTotalStatCount(): Promise<number> {
  const { count } = await supabase
    .from('cyberstats_rss')
    .select('*', { count: 'exact', head: true })

  return count ?? 0
}

export async function getUniqueReportCount(): Promise<number> {
  const { data } = await supabase
    .from('cyberstats_rss')
    .select('source_name')

  if (!data) return 0

  const unique = new Set<string>()
  for (const row of data) {
    if (row.source_name) unique.add(row.source_name.trim())
  }
  return unique.size
}
