import Link from 'next/link'
import { getEnabledClusters } from '@/data/clusters'
import StatCard from '@/components/StatCard'
import { getTotalStatCount, getUniqueReportCount, getAllPublishers, getStatsForIndustry, getStatsForThreat, getMostRecentDate, getRecentStats } from '@/lib/static-data'
import { formatDate } from '@/lib/utils'
import { slugify } from '@/lib/utils'
import { JsonLd, websiteSchema, datasetSchema } from '@/components/JsonLd'

export const revalidate = 3600

const THREAT_CARDS = [
  { name: 'Ransomware', slug: 'ransomware', desc: 'The most heavily reported topic here, and the one where publishers disagree most about how often organisations pay.' },
  { name: 'Phishing', slug: 'phishing', desc: 'Click rates and BEC losses. Watch for figures that count attempts rather than successful attacks.' },
  { name: 'Data Breach', slug: 'data-breach', desc: 'Breach costs and detection times.' },
  { name: 'Fraud', slug: 'fraud', desc: 'Now dominated by deepfake and AI-assisted scams.' },
  { name: 'DDoS', slug: 'ddos', desc: '' },
  { name: 'Insider Threat', slug: 'insider-threat', desc: 'Negligent insiders outnumber malicious ones in almost every source.' },
]

const COMPARE_CARDS = [
  { a: 'Ransomware', b: 'Phishing', slug: 'ransomware-vs-phishing' },
  { a: 'Ransomware', b: 'Data Breach', slug: 'ransomware-vs-data-breach' },
  { a: 'Fraud', b: 'Phishing', slug: 'fraud-vs-phishing' },
  { a: 'Insider Threat', b: 'Cyber Attack', slug: 'insider-threat-vs-cyber-attack' },
]

export default async function HomePage() {
  const clusters = getEnabledClusters()
  const totalStats = getTotalStatCount()
  const reportCount = getUniqueReportCount()
  const publishers = getAllPublishers()
  const topPublishers = publishers.slice(0, 8)

  // Get actual stat counts for industry cards
  const industryCounts = clusters.map((c) => ({
    ...c,
    statCount: getStatsForIndustry(c.industry).length,
    sourceCount: new Set(getStatsForIndustry(c.industry).map((s) => s.publisher)).size,
  }))

  // Get actual stat counts for threat cards
  const threatCounts = THREAT_CARDS.map((t) => ({
    ...t,
    statCount: getStatsForThreat(t.name).length,
  }))

  // The newest statistics, one per report. This used to be a hardcoded quote
  // that never changed, which made the whole page look abandoned.
  const [featured, ...recentStats] = getRecentStats(7)

  return (
    <div>
      <JsonLd data={websiteSchema()} />
      <JsonLd data={datasetSchema({
        name: 'Cybersecurity Statistics Database',
        description: `${totalStats.toLocaleString()} cybersecurity statistics from ${reportCount} published industry reports.`,
        url: 'https://cybersecuritystats.com',
        keywords: ['cybersecurity statistics', 'ransomware statistics', 'data breach statistics'],
        statCount: totalStats,
      })} />

      {/* Hero — left-aligned, editorial feel */}
      <div>
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.95] mb-6">
                Cybersecurity Statistics
              </h1>
              <p className="text-lg text-[var(--muted)] mb-8 max-w-lg">
                Every figure is quoted as its publisher wrote it and linked back to the
                report it came from, so you can check it before you cite it.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/industry/healthcare"
                  className="border border-[var(--border)] px-5 py-2.5 text-sm font-bold hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
                >
                  Browse by Industry
                </Link>
                <Link
                  href="/threats/ransomware"
                  className="bg-[var(--accent)] text-[var(--accent-fg)] px-5 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  Browse by Topic
                </Link>
              </div>
            </div>

            {/* Featured stat — editorial hook */}
            <div className="border border-[var(--border)] p-6 bg-[var(--surface)]">
              <p className="text-xs text-[var(--muted)] mb-3">
                Most recent
              </p>
              <p className="text-[15px] font-medium leading-relaxed mb-4">
                {featured.link ? (
                  <a href={featured.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {featured.title}
                  </a>
                ) : featured.title}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {featured.publisher}, {featured.source_name}
              </p>
            </div>
          </div>

          {/* Quick stats bar */}
          <div className="mt-12 pt-6 flex flex-wrap gap-6 md:gap-8">
            <div>
              <span className="text-2xl font-black">{totalStats.toLocaleString()}</span>
              <span className="text-xs text-[var(--muted)] ml-2">statistics</span>
            </div>
            <div>
              <span className="text-2xl font-black">{reportCount.toLocaleString()}</span>
              <span className="text-xs text-[var(--muted)] ml-2">reports</span>
            </div>
            <div>
              <span className="text-2xl font-black">{publishers.length}</span>
              <span className="text-xs text-[var(--muted)] ml-2">publishers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Latest statistics. The page was navigation all the way down: five
            browse grids and not one figure from the database it indexes. */}
        <div className="py-12">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-lg font-bold">Latest statistics</h2>
          </div>
          <p className="text-xs text-[var(--muted)] mb-6">
            The newest addition from each of the last six reports.
          </p>
          <div>
            {recentStats.map((stat, i) => (
              <StatCard key={i} stat={stat} />
            ))}
          </div>
        </div>

        {/* Industries section — with real counts */}
        <div className="py-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg font-bold">
              Browse by Industry
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {industryCounts.map((cluster) => (
              <Link
                key={cluster.id}
                href={`/industry/${cluster.id}`}
                className="border border-[var(--border)] p-6 hover:bg-[var(--surface)] transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold tracking-tight group-hover:underline">
                    {cluster.label}
                  </h3>
                  <span className="text-xs text-[var(--muted)]">
                    {cluster.statCount} stats &middot; {cluster.sourceCount} sources
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cluster.threats.map((threat) => (
                    <span
                      key={threat}
                      className="inline-block border border-[var(--border-light)] px-2 py-0.5 text-xs text-xs text-[var(--muted)]"
                    >
                      {threat}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Topics section — with real counts */}
        <div className="py-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg font-bold">
              Browse by Topic
            </h2>
            <Link
              href="/threats/ransomware"
              className="text-xs underline"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {threatCounts.map((threat) => (
              <Link
                key={threat.slug}
                href={`/threats/${threat.slug}`}
                className="border border-[var(--border)] p-5 hover:bg-[var(--surface)] transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-black tracking-tight group-hover:underline">
                    {threat.name}
                  </h3>
                  <span className="text-xs text-[var(--muted)] shrink-0">
                    {threat.statCount}
                  </span>
                </div>
                {threat.desc && (
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    {threat.desc}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Compare section */}
        <div className="py-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg font-bold">
              Compare
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COMPARE_CARDS.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="border border-[var(--border)] p-4 text-center hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] hover:border-[var(--accent)] transition-colors"
              >
                <span className="text-sm font-bold">
                  {comp.a} vs {comp.b}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Top publishers */}
        <div className="py-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg font-bold">
              Top Publishers
            </h2>
            <Link
              href="/publishers"
              className="text-xs underline"
            >
              View All {publishers.length} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {topPublishers.map((pub) => (
              <Link
                key={pub.publisher}
                href={`/publishers/${slugify(pub.publisher)}`}
                className="border border-[var(--border)] p-4 hover:bg-[var(--surface)] transition-colors"
              >
                <span className="text-sm font-bold block truncate">{pub.publisher}</span>
                <span className="text-xs text-[var(--muted)] mt-1 block">
                  {pub.count} stats
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* About blurb with editorial voice */}
        <div className="py-12">
          <div className="max-w-xl">
            <p className="text-sm leading-relaxed">
              Every statistic links to the report it came from, with the publisher and
              publication date attached.{' '}
              <Link href="/about" className="underline">
                Read about our methodology &rarr;
              </Link>
            </p>
            <p className="text-xs text-[var(--muted)] mt-3">
              Curated by <Link href="/author" className="hover:underline">Laura Martisiute</Link>. Last updated {formatDate(getMostRecentDate())}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
