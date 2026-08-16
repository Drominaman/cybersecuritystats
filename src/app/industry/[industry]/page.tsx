import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStatsForIndustry } from '@/lib/static-data'
import { getEnabledClusters } from '@/data/clusters'
import { slugify, formatNumber } from '@/lib/utils'
import { THREAT_NORMALIZE } from '@/data/tag-normalize'
import StatCard from '@/components/StatCard'
import { diversifyBySource } from '@/lib/diversify'

export const revalidate = 86400

interface Props {
  params: Promise<{ industry: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params
  const clusters = getEnabledClusters()
  const cluster = clusters.find((c) => c.id === industry)
  if (!cluster) return {}

  const title = `${cluster.label} Cybersecurity Statistics 2026`
  const description = `Cybersecurity statistics for the ${cluster.label.toLowerCase()} sector. Ransomware, data breaches, phishing, and more from industry reports.`

  return { title, description, openGraph: { title, description } }
}

export async function generateStaticParams() {
  return getEnabledClusters().map((c) => ({ industry: c.id }))
}

export default async function IndustryPage({ params }: Props) {
  const { industry } = await params
  const clusters = getEnabledClusters()
  const cluster = clusters.find((c) => c.id === industry)
  if (!cluster) notFound()

  const stats = await getStatsForIndustry(cluster.industry)

  // Count threats in this industry's stats
  const threatCounts = new Map<string, number>()
  for (const stat of stats) {
    const tags = [stat.tag1, stat.tag2, stat.tag3, stat.tag4, stat.tag5].filter(Boolean)
    for (const tag of tags) {
      const normalized = THREAT_NORMALIZE[tag as string]
      if (normalized) {
        threatCounts.set(normalized, (threatCounts.get(normalized) ?? 0) + 1)
      }
    }
  }

  const topThreats = [...threatCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const publishers = [...new Set(stats.map((s) => s.publisher).filter(Boolean))]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-xs text-[var(--muted)] mb-10 text-xs">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{cluster.label}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter leading-none mb-3">
          <span>{cluster.label}</span> Cybersecurity Statistics
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
          {/* Threat breakdown */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xs text-[var(--muted)]">
                Top Topics in {cluster.label}
              </h2>
              <div className="flex-1 border-t border-[var(--border)]" />
            </div>
            <div className="border border-[var(--border)] divide-y divide-[var(--border)]">
              {topThreats.map(([threat, count]) => (
                <Link
                  key={threat}
                  href={`/industry/${industry}/${slugify(threat)}`}
                  className="flex items-center justify-between p-3 text-sm font-bold hover:bg-[var(--surface)] transition-colors"
                >
                  <span>{threat}</span>
                  <span className="text-[var(--muted)] text-xs">{count}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent stats */}
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xs text-[var(--muted)]">
              Latest Statistics
            </h2>
            <div className="flex-1 border-t border-[var(--border)]" />
          </div>
          {diversifyBySource(stats, 30).map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>

        <aside className="text-sm">
          {/* Matrix links for this industry */}
          <div className="mb-8 border border-[var(--border)] p-4">
            <h2 className="text-xs text-[var(--muted)] mb-3 pb-2 border-b border-[var(--border)]">
              Browse by Topic
            </h2>
            <div className="flex flex-col gap-0.5">
              {cluster.threats.map((threat) => (
                <Link
                  key={threat}
                  href={`/industry/${industry}/${slugify(threat)}`}
                  className="py-1.5 text-xs text-[var(--muted)] hover:underline"
                >
                  {cluster.label} &times; {threat}
                </Link>
              ))}
            </div>
          </div>

          {/* Other industries */}
          <div className="border border-[var(--border)] p-4">
            <h2 className="text-xs text-[var(--muted)] mb-3 pb-2 border-b border-[var(--border)]">
              Other Industries
            </h2>
            <div className="flex flex-col gap-0.5">
              {clusters
                .filter((c) => c.id !== industry)
                .map((c) => (
                  <Link
                    key={c.id}
                    href={`/industry/${c.id}`}
                    className="py-1.5 text-xs text-[var(--muted)] hover:underline"
                  >
                    {c.label}
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
