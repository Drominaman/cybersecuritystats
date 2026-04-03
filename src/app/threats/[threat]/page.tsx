import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStatsForThreat } from '@/lib/static-data'
import { getEnabledClusters } from '@/data/clusters'
import { INDUSTRY_NORMALIZE } from '@/data/tag-normalize'
import { slugify, formatNumber } from '@/lib/utils'
import StatCard from '@/components/StatCard'

import { THREAT_LABELS } from '@/data/threats'

export const revalidate = 86400

interface Props {
  params: Promise<{ threat: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { threat } = await params
  const label = THREAT_LABELS[threat]
  if (!label) return {}

  const title = `${label} Statistics 2026`
  const description = `${label} cybersecurity statistics from industry reports. Attack frequency, costs, trends, and industry breakdowns.`
  return { title, description, openGraph: { title, description } }
}

export async function generateStaticParams() {
  const clusters = getEnabledClusters()
  const threatSlugs = new Set<string>()
  for (const c of clusters) {
    for (const t of c.threats) {
      threatSlugs.add(slugify(t))
    }
  }
  return [...threatSlugs].map((threat) => ({ threat }))
}

export default async function ThreatPage({ params }: Props) {
  const { threat } = await params
  const label = THREAT_LABELS[threat]
  if (!label) notFound()

  const stats = await getStatsForThreat(label)
  const clusters = getEnabledClusters()

  // Count industries in this threat's stats
  const industryCounts = new Map<string, number>()
  for (const stat of stats) {
    const tags = [stat.tag1, stat.tag2, stat.tag3, stat.tag4, stat.tag5].filter(Boolean)
    for (const tag of tags) {
      const normalized = INDUSTRY_NORMALIZE[tag as string]
      if (normalized) {
        industryCounts.set(normalized, (industryCounts.get(normalized) ?? 0) + 1)
      }
    }
  }

  const topIndustries = [...industryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)

  const publishers = [...new Set(stats.map((s) => s.publisher).filter(Boolean))]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-[10px] text-[var(--muted)] mb-10 font-mono uppercase tracking-[0.2em]">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{label}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter leading-none mb-3">
          <span className="text-[var(--accent)]">{label}</span> Statistics
        </h1>
        <div className="flex items-center gap-4 mt-4">
          <span className="bg-[var(--foreground)] text-[var(--background)] px-3 py-1 font-mono text-xs font-bold">
            {formatNumber(stats.length)} STATS
          </span>
          <span className="bg-[var(--accent)] text-[var(--accent-fg)] px-3 py-1 font-mono text-xs font-bold">
            {publishers.length} SOURCES
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
        <div>
          {/* Industry breakdown */}
          {topIndustries.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  {label} by Industry
                </h2>
                <div className="flex-1 border-t-2 border-[var(--border)]" />
              </div>
              <div className="border-2 border-[var(--border)] divide-y-2 divide-[var(--border)]">
                {topIndustries.map(([industry, count]) => {
                  const cluster = clusters.find(
                    (c) => c.industry === industry && c.threats.some((t) => slugify(t) === threat)
                  )
                  return (
                    <div key={industry} className="flex items-center justify-between p-3">
                      {cluster ? (
                        <Link
                          href={`/industry/${cluster.id}/${threat}`}
                          className="text-sm font-bold hover:text-[var(--accent)]"
                        >
                          {industry}
                        </Link>
                      ) : (
                        <span className="text-sm">{industry}</span>
                      )}
                      <span className="font-mono text-xs text-[var(--muted)]">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Latest Statistics
            </h2>
            <div className="flex-1 border-t-2 border-[var(--border)]" />
          </div>
          {stats.slice(0, 40).map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>

        <aside className="text-sm">
          {/* Other threats */}
          <div className="mb-8 border-2 border-[var(--border)] p-4">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-3 pb-2 border-b-2 border-[var(--border)]">
              All Threats
            </h3>
            <div className="flex flex-col gap-0.5">
              {Object.entries(THREAT_LABELS).map(([slug, name]) => (
                <Link
                  key={slug}
                  href={`/threats/${slug}`}
                  className={`py-1.5 font-mono text-xs uppercase tracking-wider hover:text-[var(--accent)] ${
                    slug === threat
                      ? 'font-bold text-[var(--foreground)] bg-[var(--highlight)] px-2 -mx-2'
                      : 'text-[var(--muted)]'
                  }`}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* Top sources */}
          <div className="border-2 border-[var(--border)] p-4">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-3 pb-2 border-b-2 border-[var(--border)]">
              Top Sources
            </h3>
            <div className="flex flex-col gap-0.5">
              {publishers.slice(0, 12).map((pub) => (
                <Link
                  key={pub}
                  href={`/publishers/${slugify(pub)}`}
                  className="text-[var(--muted)] hover:text-[var(--accent)] py-1 text-xs"
                >
                  {pub}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
