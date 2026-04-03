import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStatsForIndustryAndThreat } from '@/lib/queries'
import { getClusterByIndustry, getEnabledClusters } from '@/data/clusters'
import { slugify } from '@/lib/utils'
import StatCard from '@/components/StatCard'
import { JsonLd, datasetSchema, breadcrumbSchema } from '@/components/JsonLd'

export const revalidate = 86400 // 24 hours

interface Props {
  params: Promise<{ industry: string; threat: string }>
}

function findClusterAndThreat(industrySlug: string, threatSlug: string) {
  const clusters = getEnabledClusters()
  const cluster = clusters.find((c) => c.id === industrySlug)
  if (!cluster) return null

  const threat = cluster.threats.find((t) => slugify(t) === threatSlug)
  if (!threat) return null

  return { cluster, threat }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, threat } = await params
  const match = findClusterAndThreat(industry, threat)
  if (!match) return {}

  const title = `${match.cluster.label} ${match.threat} Statistics 2026`
  const description = `${match.cluster.label} ${match.threat.toLowerCase()} cybersecurity statistics from industry reports. Data on attacks, costs, and trends.`

  return {
    title,
    description,
    openGraph: { title, description },
  }
}

export async function generateStaticParams() {
  const clusters = getEnabledClusters()
  const paths: { industry: string; threat: string }[] = []

  for (const cluster of clusters) {
    for (const threat of cluster.threats) {
      paths.push({ industry: cluster.id, threat: slugify(threat) })
    }
  }

  return paths
}

export default async function MatrixPage({ params }: Props) {
  const { industry, threat } = await params
  const match = findClusterAndThreat(industry, threat)
  if (!match) notFound()

  const stats = await getStatsForIndustryAndThreat(
    match.cluster.industry,
    match.threat
  )

  const clusters = getEnabledClusters()

  // Unique publishers in this intersection
  const publishers = [...new Set(stats.map((s) => s.publisher).filter(Boolean))]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <JsonLd data={datasetSchema({
        name: `${match.cluster.label} ${match.threat} Statistics`,
        description: `${stats.length} ${match.cluster.label.toLowerCase()} ${match.threat.toLowerCase()} cybersecurity statistics from ${publishers.length} sources.`,
        url: `https://cybersecuritystats.com/industry/${industry}/${slugify(match.threat)}`,
        keywords: [match.cluster.label, match.threat, 'cybersecurity statistics', `${match.cluster.label} ${match.threat}`],
        statCount: stats.length,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://cybersecuritystats.com' },
        { name: match.cluster.label, url: `https://cybersecuritystats.com/industry/${industry}` },
        { name: match.threat, url: `https://cybersecuritystats.com/industry/${industry}/${slugify(match.threat)}` },
      ])} />
      {/* Breadcrumb */}
      <nav className="text-[10px] text-[var(--muted)] mb-10 font-mono uppercase tracking-[0.2em]">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/industry/${industry}`} className="hover:text-[var(--accent)]">
          {match.cluster.label}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{match.threat}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter leading-none mb-3">
          {match.cluster.label}{' '}
          <span className="text-[var(--accent)]">{match.threat}</span>{' '}
          Statistics
        </h1>
        <div className="flex items-center gap-4 mt-4">
          <span className="bg-[var(--foreground)] text-[var(--background)] px-3 py-1 font-mono text-xs font-bold">
            {stats.length} STATS
          </span>
          <span className="bg-[var(--accent)] text-[var(--accent-fg)] px-3 py-1 font-mono text-xs font-bold">
            {publishers.length} SOURCES
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
        {/* Stats list */}
        <div>
          {stats.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No statistics found for this intersection.</p>
          ) : (
            stats.map((stat, i) => <StatCard key={i} stat={stat} />)
          )}
        </div>

        {/* Sidebar */}
        <aside className="text-sm">
          {/* Same industry, other threats */}
          <div className="mb-8 border-2 border-[var(--border)] p-4">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-3 pb-2 border-b-2 border-[var(--border)]">
              {match.cluster.label} Threats
            </h3>
            <div className="flex flex-col gap-0.5">
              {match.cluster.threats.map((t) => (
                <Link
                  key={t}
                  href={`/industry/${industry}/${slugify(t)}`}
                  className={`py-1.5 font-mono text-xs uppercase tracking-wider hover:text-[var(--accent)] ${
                    t === match.threat
                      ? 'font-bold text-[var(--foreground)] bg-[var(--highlight)] px-2 -mx-2'
                      : 'text-[var(--muted)]'
                  }`}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          {/* Same threat, other industries */}
          <div className="mb-8 border-2 border-[var(--border)] p-4">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-3 pb-2 border-b-2 border-[var(--border)]">
              {match.threat} by Industry
            </h3>
            <div className="flex flex-col gap-0.5">
              {clusters
                .filter((c) => c.threats.some((t) => slugify(t) === slugify(match.threat)))
                .map((c) => (
                  <Link
                    key={c.id}
                    href={`/industry/${c.id}/${slugify(match.threat)}`}
                    className={`py-1.5 font-mono text-xs uppercase tracking-wider hover:text-[var(--accent)] ${
                      c.id === industry
                        ? 'font-bold text-[var(--foreground)] bg-[var(--highlight)] px-2 -mx-2'
                        : 'text-[var(--muted)]'
                    }`}
                  >
                    {c.label}
                  </Link>
                ))}
            </div>
          </div>

          {/* Sources */}
          {publishers.length > 0 && (
            <div className="border-2 border-[var(--border)] p-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-3 pb-2 border-b-2 border-[var(--border)]">
                Sources
              </h3>
              <div className="flex flex-col gap-0.5">
                {publishers.slice(0, 10).map((pub) => (
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
          )}
        </aside>
      </div>
    </div>
  )
}
