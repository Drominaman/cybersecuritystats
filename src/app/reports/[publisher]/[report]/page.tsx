import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStatsForPublisher, getAllPublishers } from '@/lib/static-data'
import { slugify, formatDate } from '@/lib/utils'
import StatCard from '@/components/StatCard'

export const revalidate = 86400
export const dynamicParams = false

interface Props {
  params: Promise<{ publisher: string; report: string }>
}

export async function generateStaticParams() {
  const publishers = getAllPublishers()
  const params: { publisher: string; report: string }[] = []

  for (const pub of publishers.filter((p) => p.count >= 3)) {
    const stats = getStatsForPublisher(pub.publisher)
    const reportNames = new Set<string>()
    for (const stat of stats) {
      if (stat.source_name) reportNames.add(stat.source_name)
    }
    for (const name of reportNames) {
      params.push({
        publisher: slugify(pub.publisher),
        report: slugify(name),
      })
    }
  }

  return params
}

function findPublisherAndReport(pubSlug: string, reportSlug: string) {
  const publishers = getAllPublishers()
  const pub = publishers.find((p) => slugify(p.publisher) === pubSlug)
  if (!pub) return null

  const stats = getStatsForPublisher(pub.publisher)

  const reports = new Map<string, typeof stats>()
  for (const stat of stats) {
    const key = stat.source_name || 'Unknown'
    if (!reports.has(key)) reports.set(key, [])
    reports.get(key)!.push(stat)
  }

  for (const [name, reportStats] of reports) {
    if (slugify(name) === reportSlug) {
      return { publisher: pub, reportName: name, stats: reportStats, allReports: reports }
    }
  }

  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publisher, report } = await params
  const match = await findPublisherAndReport(publisher, report)
  if (!match) return {}

  const title = `${match.reportName} — ${match.publisher.publisher}`
  const description = `Key findings from ${match.reportName} by ${match.publisher.publisher}. ${match.stats.length} statistics and data points.`
  return { title, description, openGraph: { title, description } }
}

export default async function ReportPage({ params }: Props) {
  const { publisher: pubSlug, report: reportSlug } = await params
  const match = await findPublisherAndReport(pubSlug, reportSlug)
  if (!match) notFound()

  const { publisher: pub, reportName, stats, allReports } = match

  // Get the original source link from the first stat
  const sourceLink = stats[0]?.link

  // Date range
  const dates = stats
    .map((s) => s.published_on)
    .filter(Boolean)
    .sort()
  const publishDate = dates[0]

  // Other reports from this publisher
  const otherReports = [...allReports.entries()]
    .filter(([name]) => name !== reportName)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-xs text-[var(--muted)] mb-10 text-xs">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/publishers/${pubSlug}`} className="hover:underline">
          {pub.publisher}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">Report</span>
      </nav>

      <div className="mb-10">
        <p className="text-xs text-[var(--muted)] mb-2">
          Report by {pub.publisher}
        </p>
        <h1 className="text-3xl font-black tracking-tighter leading-tight mb-4">
          {reportName}
        </h1>
        <div className="flex items-center gap-4">
          <span className="bg-[var(--foreground)] text-[var(--background)] px-3 py-1 text-xs font-bold">
            {stats.length} FINDINGS
          </span>
          {publishDate && (
            <span className="text-xs text-[var(--muted)]">
              Published {formatDate(publishDate)}
            </span>
          )}
        </div>
        {sourceLink && (
          <a
            href={sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 border border-[var(--accent)] text-[var(--accent)] px-4 py-2 text-sm font-bold hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors"
          >
            View Original Report &rarr;
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xs text-[var(--muted)]">
              Key Findings
            </h2>
            <div className="flex-1 border-t border-[var(--border)]" />
          </div>
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>

        <aside className="text-sm">
          {/* Other reports from same publisher */}
          {otherReports.length > 0 && (
            <div className="border border-[var(--border)] p-4">
              <h3 className="text-xs text-[var(--muted)] mb-3 pb-2 border-b border-[var(--border)]">
                More from {pub.publisher}
              </h3>
              <div className="flex flex-col gap-1">
                {otherReports.map(([name, reportStats]) => (
                  <Link
                    key={name}
                    href={`/reports/${pubSlug}/${slugify(name)}`}
                    className="text-[var(--muted)] hover:underline py-1 text-xs leading-snug"
                  >
                    {name} ({reportStats.length})
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
