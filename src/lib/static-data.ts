/**
 * Reads pre-fetched data from src/data/generated/*.json
 * No runtime Supabase calls — everything served from build-time snapshots.
 */
import type { Stat } from '@/types'
import { INDUSTRY_NORMALIZE, THREAT_NORMALIZE } from '@/data/tag-normalize'

import rawStats from '@/data/generated/stats.json'
import rawPublishers from '@/data/generated/publishers.json'
import rawMeta from '@/data/generated/meta.json'

const stats = rawStats as Stat[]
const publishers = rawPublishers as { publisher: string; count: number }[]
const meta = rawMeta as { totalStats: number; uniqueReports: number; publisherCount: number }

function getStatTags(stat: Stat): string[] {
  return [stat.tag1, stat.tag2, stat.tag3, stat.tag4, stat.tag5]
    .filter((t): t is string => Boolean(t))
}

function getTagsForNormalized(normalize: Record<string, string>, canonical: string): string[] {
  return Object.entries(normalize)
    .filter(([, v]) => v === canonical)
    .map(([k]) => k)
}

// --- Public API (drop-in replacements for queries.ts) ---

export function getTotalStatCount(): number {
  return meta.totalStats
}

export function getUniqueReportCount(): number {
  return meta.uniqueReports
}

export function getAllPublishers(): { publisher: string; count: number }[] {
  return publishers
}

export function getMostRecentDate(): string {
  for (const stat of stats) {
    if (stat.published_on) return stat.published_on
  }
  return new Date().toISOString().slice(0, 10)
}

export function getStatsForIndustryAndThreat(industry: string, threat: string): Stat[] {
  const industryTags = getTagsForNormalized(INDUSTRY_NORMALIZE, industry).map(t => t.toLowerCase())
  const threatTags = getTagsForNormalized(THREAT_NORMALIZE, threat).map(t => t.toLowerCase())

  if (industryTags.length === 0 || threatTags.length === 0) return []

  return stats.filter((stat) => {
    const tags = getStatTags(stat).map(t => t.toLowerCase())
    const hasIndustry = industryTags.some(it => tags.some(t => t.includes(it)))
    const hasThreat = threatTags.some(tt => tags.some(t => t.includes(tt)))
    return hasIndustry && hasThreat
  })
}

export function getStatsForIndustry(industry: string): Stat[] {
  const industryTags = getTagsForNormalized(INDUSTRY_NORMALIZE, industry).map(t => t.toLowerCase())
  if (industryTags.length === 0) return []

  return stats.filter((stat) => {
    const tags = getStatTags(stat).map(t => t.toLowerCase())
    return industryTags.some(it => tags.some(t => t.includes(it)))
  })
}

export function getStatsForThreat(threat: string): Stat[] {
  const threatTags = getTagsForNormalized(THREAT_NORMALIZE, threat).map(t => t.toLowerCase())
  if (threatTags.length === 0) return []

  return stats.filter((stat) => {
    const tags = getStatTags(stat).map(t => t.toLowerCase())
    return threatTags.some(tt => tags.some(t => t.includes(tt)))
  })
}

export function getStatsForPublisher(publisherName: string): Stat[] {
  return stats.filter((stat) => stat.publisher === publisherName)
}

export function getStatsForReport(publisherName: string, sourceName: string): Stat[] {
  return stats.filter(
    (stat) => stat.publisher === publisherName && stat.source_name === sourceName
  )
}
