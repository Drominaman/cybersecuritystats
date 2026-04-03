import Link from 'next/link'
import { getEnabledClusters } from '@/data/clusters'
import { getTotalStatCount, getUniqueReportCount, getAllPublishers, getStatsForIndustry, getStatsForThreat } from '@/lib/static-data'
import { slugify } from '@/lib/utils'
import { JsonLd, websiteSchema, datasetSchema } from '@/components/JsonLd'

export const revalidate = 3600

const THREAT_CARDS = [
  { name: 'Ransomware', slug: 'ransomware', desc: 'Attack frequency, ransom payments, recovery costs, and industry breakdowns.' },
  { name: 'Phishing', slug: 'phishing', desc: 'Email threats, click rates, BEC incidents, and AI-assisted phishing trends.' },
  { name: 'Data Breach', slug: 'data-breach', desc: 'Breach costs, detection times, records exposed, and compliance impact.' },
  { name: 'Fraud', slug: 'fraud', desc: 'Financial fraud, identity theft, deepfake scams, and AI-powered fraud trends.' },
  { name: 'DDoS', slug: 'ddos', desc: 'Attack volume, duration, mitigation costs, and targeted industries.' },
  { name: 'Insider Threat', slug: 'insider-threat', desc: 'Employee risk, data exfiltration, negligent vs malicious insiders.' },
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

  // Pick a featured stat — most recent notable one
  const featuredStat = '93% of CISOs and AppSec executives are ready to replace or purchase new AI-native application protection.'
  const featuredSource = 'Rein Security, 2026'

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
      <div className="border-b-4 border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
                Updated April 2026
              </p>
              <h1 className="text-5xl font-black tracking-tighter leading-[0.95] mb-6">
                Cybersecurity Statistics,<br />
                Indexed &amp; Organized
              </h1>
              <p className="text-lg text-[var(--muted)] mb-8 max-w-lg">
                {totalStats.toLocaleString()} data points from {reportCount.toLocaleString()} industry reports.
                Browse by sector, threat type, or publisher.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/industry/healthcare"
                  className="border-2 border-[var(--border)] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
                >
                  Browse by Industry
                </Link>
                <Link
                  href="/threats/ransomware"
                  className="bg-[var(--accent)] text-[var(--accent-fg)] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Browse by Topic
                </Link>
              </div>
            </div>

            {/* Featured stat — editorial hook */}
            <div className="border-2 border-[var(--border)] p-6 bg-[var(--surface)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
                Featured Stat
              </p>
              <p className="text-[15px] font-medium leading-relaxed mb-4">
                &ldquo;{featuredStat}&rdquo;
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                {featuredSource}
              </p>
            </div>
          </div>

          {/* Quick stats bar */}
          <div className="mt-12 pt-6 border-t-2 border-[var(--border)] flex gap-8">
            <div>
              <span className="text-2xl font-black">{totalStats.toLocaleString()}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] ml-2">statistics</span>
            </div>
            <div>
              <span className="text-2xl font-black">{reportCount.toLocaleString()}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] ml-2">reports</span>
            </div>
            <div>
              <span className="text-2xl font-black">{publishers.length}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] ml-2">publishers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Industries section — with real counts */}
        <div className="py-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Browse by Industry
            </h2>
            <div className="flex-1 border-t-2 border-[var(--border)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {industryCounts.map((cluster) => (
              <Link
                key={cluster.id}
                href={`/industry/${cluster.id}`}
                className="border-2 border-[var(--border)] p-6 hover:bg-[var(--surface)] transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-[var(--accent)]">
                    {cluster.label}
                  </h3>
                  <span className="font-mono text-xs text-[var(--muted)]">
                    {cluster.statCount} stats &middot; {cluster.sourceCount} sources
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cluster.threats.map((threat) => (
                    <span
                      key={threat}
                      className="inline-block border border-[var(--border-light)] px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]"
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
        <div className="py-12 border-t-2 border-[var(--border)]">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Browse by Topic
            </h2>
            <div className="flex-1 border-t-2 border-[var(--border)]" />
            <Link
              href="/threats/ransomware"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {threatCounts.map((threat) => (
              <Link
                key={threat.slug}
                href={`/threats/${threat.slug}`}
                className="border-2 border-[var(--border)] p-5 hover:bg-[var(--surface)] transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-black tracking-tight group-hover:text-[var(--accent)]">
                    {threat.name}
                  </h3>
                  <span className="font-mono text-[10px] text-[var(--muted)] shrink-0">
                    {threat.statCount}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {threat.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Compare section */}
        <div className="py-12 border-t-2 border-[var(--border)]">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Compare
            </h2>
            <div className="flex-1 border-t-2 border-[var(--border)]" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COMPARE_CARDS.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="border-2 border-[var(--border)] p-4 text-center hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] hover:border-[var(--accent)] transition-colors"
              >
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  {comp.a} vs {comp.b}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Top publishers */}
        <div className="py-12 border-t-2 border-[var(--border)]">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Top Publishers
            </h2>
            <div className="flex-1 border-t-2 border-[var(--border)]" />
            <Link
              href="/publishers"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] hover:underline"
            >
              View All {publishers.length} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {topPublishers.map((pub) => (
              <Link
                key={pub.publisher}
                href={`/publishers/${slugify(pub.publisher)}`}
                className="border-2 border-[var(--border)] p-4 hover:bg-[var(--surface)] transition-colors"
              >
                <span className="text-sm font-bold block truncate">{pub.publisher}</span>
                <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider mt-1 block">
                  {pub.count} stats
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* About blurb with editorial voice */}
        <div className="py-12 border-t-2 border-[var(--border)]">
          <div className="max-w-xl">
            <p className="text-sm leading-relaxed">
              Built for security researchers, analysts, and CISOs who need data, not marketing.
              Every statistic links to its original source report.{' '}
              <Link href="/about" className="text-[var(--accent)] hover:underline">
                Read about our methodology &rarr;
              </Link>
            </p>
            <p className="text-xs text-[var(--muted)] mt-3">
              Curated by <Link href="/author" className="hover:text-[var(--accent)]">Laura Martisiute</Link>. Last updated April 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
