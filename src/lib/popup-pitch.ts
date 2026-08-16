import { THREAT_LABELS } from '@/data/threats'
import { getEnabledClusters } from '@/data/clusters'
import {
  getTotalStatCount,
  getUniqueReportCount,
  getStatsForThreat,
  getStatsForIndustry,
} from '@/lib/static-data'

export type Pitch = { label: string; stats: number; sources: number }

export type PitchData = {
  total: Pitch
  threats: Record<string, Pitch>
  industries: Record<string, Pitch>
}

function summarise(label: string, rows: { publisher: string }[]): Pitch {
  return {
    label,
    stats: rows.length,
    sources: new Set(rows.map((r) => r.publisher).filter(Boolean)).size,
  }
}

/**
 * Counts for the newsletter popup, worked out at build time.
 *
 * The popup used to make the same general claim on every page. A reader on the
 * ransomware page is told what is in the ransomware set instead, because a
 * number they can check beats an adjective they cannot.
 *
 * Only routes that actually exist are included, so the payload stays small and
 * the popup can fall back to the site totals when it recognises nothing.
 */
export function getPitchData(): PitchData {
  const threats: Record<string, Pitch> = {}
  for (const [slug, label] of Object.entries(THREAT_LABELS)) {
    const rows = getStatsForThreat(label)
    if (rows.length > 0) threats[slug] = summarise(label, rows)
  }

  const industries: Record<string, Pitch> = {}
  for (const cluster of getEnabledClusters()) {
    const rows = getStatsForIndustry(cluster.industry)
    if (rows.length > 0) industries[cluster.id] = summarise(cluster.label, rows)
  }

  return {
    total: {
      label: 'cybersecurity',
      stats: getTotalStatCount(),
      sources: getUniqueReportCount(),
    },
    threats,
    industries,
  }
}
