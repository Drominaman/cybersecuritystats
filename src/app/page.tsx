import Link from 'next/link'
import { getEnabledClusters } from '@/data/clusters'
import { getTotalStatCount, getUniqueReportCount, getAllPublishers } from '@/lib/queries'
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
  const [totalStats, reportCount, publishers] = await Promise.all([
    getTotalStatCount(),
    getUniqueReportCount(),
    getAllPublishers(),
  ])

  const topPublishers = publishers.slice(0, 8)

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

      {/* Hero — centered, discovery-focused */}
      <div className="border-b-4 border-[var(--border)] py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">
            Discover Cybersecurity{' '}
            <span className="text-[var(--accent)]">Statistics</span>
          </h1>
          <p className="text-lg text-[var(--muted)] mb-8">
            Browse {totalStats.toLocaleString()} data points from {reportCount.toLocaleString()} industry reports,
            organized by sector and threat type
          </p>
          <div className="flex justify-center gap-3">
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
              Browse by Threat
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Industries section */}
        <div className="py-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Browse by Industry
            </h2>
            <div className="flex-1 border-t-2 border-[var(--border)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clusters.map((cluster) => (
              <Link
                key={cluster.id}
                href={`/industry/${cluster.id}`}
                className="border-2 border-[var(--border)] p-6 hover:bg-[var(--surface)] transition-colors group"
              >
                <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-[var(--accent)]">
                  {cluster.label}
                </h3>
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

        {/* Threats section */}
        <div className="py-16 border-t-2 border-[var(--border)]">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Trending Threats
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
            {THREAT_CARDS.map((threat) => (
              <Link
                key={threat.slug}
                href={`/threats/${threat.slug}`}
                className="border-2 border-[var(--border)] p-5 hover:bg-[var(--surface)] transition-colors group"
              >
                <h3 className="text-lg font-black tracking-tight group-hover:text-[var(--accent)]">
                  {threat.name}
                </h3>
                <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
                  {threat.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Compare section */}
        <div className="py-16 border-t-2 border-[var(--border)]">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Compare Threats
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
        <div className="py-16 border-t-2 border-[var(--border)]">
          <div className="flex items-center gap-4 mb-8">
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

        {/* About blurb */}
        <div className="py-16 border-t-2 border-[var(--border)]">
          <div className="max-w-xl">
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              We aggregate cybersecurity statistics from published industry reports
              and organize them by sector and attack type. Every stat links to its
              original source.{' '}
              <Link href="/about" className="text-[var(--accent)] hover:underline">
                Learn more &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
