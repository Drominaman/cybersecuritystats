import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStatsForThreat } from '@/lib/static-data'
import { getEnabledClusters } from '@/data/clusters'
import { INDUSTRY_NORMALIZE } from '@/data/tag-normalize'
import { slugify, formatNumber } from '@/lib/utils'
import StatCard from '@/components/StatCard'
import { JsonLd, datasetSchema, breadcrumbSchema } from '@/components/JsonLd'

import { THREAT_LABELS } from '@/data/threats'
import { diversifyBySource } from '@/lib/diversify'

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
      <JsonLd data={datasetSchema({
        name: `${label} Statistics`,
        description: `${stats.length} ${label.toLowerCase()} cybersecurity statistics from ${publishers.length} sources.`,
        url: `https://cybersecuritystats.com/threats/${threat}`,
        keywords: [label, 'cybersecurity statistics', `${label} statistics`],
        statCount: stats.length,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://cybersecuritystats.com' },
        { name: label, url: `https://cybersecuritystats.com/threats/${threat}` },
      ])} />
      <nav className="text-xs text-[var(--muted)] mb-10 text-xs">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{label}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter leading-none mb-3">
          <span>{label}</span> Statistics
        </h1>
        <div className="flex items-center gap-4 mt-4">
          <span className="bg-[var(--foreground)] text-[var(--background)] px-3 py-1 text-xs font-bold">
            {formatNumber(stats.length)} stats
          </span>
          <span className="bg-[var(--accent)] text-[var(--accent-fg)] px-3 py-1 text-xs font-bold">
            {publishers.length} sources
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
        <div>
          {/* Industry breakdown */}
          {topIndustries.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xs text-[var(--muted)]">
                  {label} by Industry
                </h2>
                <div className="flex-1 border-t border-[var(--border)]" />
              </div>
              <div className="border border-[var(--border)] divide-y divide-[var(--border)]">
                {topIndustries.map(([industry, count]) => {
                  const cluster = clusters.find((c) => c.industry === industry)
                  return (
                    <Link
                      key={industry}
                      href={cluster ? `/industry/${cluster.id}/${threat}` : `/threats/${threat}`}
                      className="flex items-center justify-between p-3 hover:bg-[var(--surface)] transition-colors"
                    >
                      <span className="text-sm font-bold hover:underline">{industry}</span>
                      <span className="text-xs text-[var(--muted)]">{count}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xs text-[var(--muted)]">
              Latest Statistics
            </h2>
            <div className="flex-1 border-t border-[var(--border)]" />
          </div>
          {diversifyBySource(stats, 40).map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>

        <aside className="text-sm">
          {/* Other threats */}
          <div className="mb-8 border border-[var(--border)] p-4">
            <h2 className="text-xs text-[var(--muted)] mb-3 pb-2 border-b border-[var(--border)]">
              All Topics
            </h2>
            <div className="flex flex-col gap-0.5">
              {Object.entries(THREAT_LABELS).map(([slug, name]) => (
                <Link
                  key={slug}
                  href={`/threats/${slug}`}
                  className={`py-1.5 text-xs hover:underline ${
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
          <div className="border border-[var(--border)] p-4">
            <h2 className="text-xs text-[var(--muted)] mb-3 pb-2 border-b border-[var(--border)]">
              Top Sources
            </h2>
            <div className="flex flex-col gap-0.5">
              {publishers.slice(0, 12).map((pub) => (
                <Link
                  key={pub}
                  href={`/publishers/${slugify(pub)}`}
                  className="text-[var(--muted)] hover:underline py-1 text-xs"
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
