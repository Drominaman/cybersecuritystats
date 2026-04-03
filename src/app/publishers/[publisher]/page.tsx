import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStatsForPublisher, getAllPublishers } from '@/lib/static-data'
import { slugify, formatNumber } from '@/lib/utils'
import StatCard from '@/components/StatCard'

export const revalidate = 86400

interface Props {
  params: Promise<{ publisher: string }>
}

async function findPublisher(slug: string) {
  const publishers = await getAllPublishers()
  return publishers.find((p) => slugify(p.publisher) === slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publisher: slug } = await params
  const pub = await findPublisher(slug)
  if (!pub) return {}

  const title = `${pub.publisher} Cybersecurity Statistics`
  const description = `${pub.count} cybersecurity statistics from ${pub.publisher}. Browse all reports and data.`
  return { title, description, openGraph: { title, description } }
}

export async function generateStaticParams() {
  const publishers = await getAllPublishers()
  return publishers
    .filter((p) => p.count >= 5)
    .slice(0, 200)
    .map((p) => ({ publisher: slugify(p.publisher) }))
}

export default async function PublisherPage({ params }: Props) {
  const { publisher: slug } = await params
  const pub = await findPublisher(slug)
  if (!pub) notFound()

  const stats = await getStatsForPublisher(pub.publisher)

  // Group stats by report (source_name)
  const reports = new Map<string, typeof stats>()
  for (const stat of stats) {
    const key = stat.source_name || 'Unknown Report'
    if (!reports.has(key)) reports.set(key, [])
    reports.get(key)!.push(stat)
  }

  const sortedReports = [...reports.entries()].sort((a, b) => b[1].length - a[1].length)

  // Collect all tags
  const tagCounts = new Map<string, number>()
  for (const stat of stats) {
    for (const tag of [stat.tag1, stat.tag2, stat.tag3, stat.tag4, stat.tag5].filter(Boolean)) {
      tagCounts.set(tag as string, (tagCounts.get(tag as string) ?? 0) + 1)
    }
  }
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-[10px] text-[var(--muted)] mb-10 font-mono uppercase tracking-[0.2em]">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/publishers" className="hover:text-[var(--accent)]">Publishers</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{pub.publisher}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter leading-none mb-3">
          {pub.publisher}
        </h1>
        <div className="flex items-center gap-4 mt-4">
          <span className="bg-[var(--foreground)] text-[var(--background)] px-3 py-1 font-mono text-xs font-bold">
            {formatNumber(stats.length)} STATS
          </span>
          <span className="bg-[var(--accent)] text-[var(--accent-fg)] px-3 py-1 font-mono text-xs font-bold">
            {sortedReports.length} REPORTS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
        <div>
          {/* Report library */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                Reports
              </h2>
              <div className="flex-1 border-t-2 border-[var(--border)]" />
            </div>
            <div className="border-2 border-[var(--border)] divide-y-2 divide-[var(--border)]">
              {sortedReports.map(([reportName, reportStats]) => (
                <Link
                  key={reportName}
                  href={`/reports/${slug}/${slugify(reportName)}`}
                  className="flex items-center justify-between p-3 hover:bg-[var(--surface)] transition-colors"
                >
                  <span className="text-sm font-medium pr-4">{reportName}</span>
                  <span className="font-mono text-xs text-[var(--muted)] shrink-0">
                    {reportStats.length} stats
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* All stats */}
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              All Statistics
            </h2>
            <div className="flex-1 border-t-2 border-[var(--border)]" />
          </div>
          {stats.slice(0, 50).map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>

        <aside className="text-sm">
          {/* Topics covered */}
          <div className="border-2 border-[var(--border)] p-4">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-3 pb-2 border-b-2 border-[var(--border)]">
              Topics Covered
            </h3>
            <div className="flex flex-wrap gap-1">
              {topTags.map(([tag, count]) => (
                <span
                  key={tag}
                  className="inline-block border border-[var(--border-light)] px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]"
                >
                  {tag} ({count})
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
