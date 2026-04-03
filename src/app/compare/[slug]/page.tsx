import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStatsForThreat } from '@/lib/static-data'
import { slugify, formatNumber } from '@/lib/utils'
import StatCard from '@/components/StatCard'

export const revalidate = 86400

const COMPARISONS = [
  { a: 'Ransomware', b: 'Phishing' },
  { a: 'Ransomware', b: 'Data Breach' },
  { a: 'Phishing', b: 'Data Breach' },
  { a: 'Insider Threat', b: 'Cyber Attack' },
  { a: 'Fraud', b: 'Phishing' },
  { a: 'Ransomware', b: 'DDoS' },
  { a: 'Malware', b: 'Ransomware' },
  { a: 'Deepfakes', b: 'Phishing' },
  { a: 'Fraud', b: 'Identity Theft' },
  { a: 'Supply Chain', b: 'Insider Threat' },
]

function makeSlug(a: string, b: string) {
  return `${slugify(a)}-vs-${slugify(b)}`
}

function parseSlug(slug: string) {
  return COMPARISONS.find((c) => makeSlug(c.a, c.b) === slug)
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const comp = parseSlug(slug)
  if (!comp) return {}

  const title = `${comp.a} vs ${comp.b} Statistics 2026`
  const description = `Compare ${comp.a.toLowerCase()} and ${comp.b.toLowerCase()} cybersecurity statistics side by side. Frequency, cost, and trend data.`
  return { title, description, openGraph: { title, description } }
}

export async function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: makeSlug(c.a, c.b) }))
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params
  const comp = parseSlug(slug)
  if (!comp) notFound()

  const [statsA, statsB] = await Promise.all([
    getStatsForThreat(comp.a),
    getStatsForThreat(comp.b),
  ])

  const publishersA = new Set(statsA.map((s) => s.publisher).filter(Boolean))
  const publishersB = new Set(statsB.map((s) => s.publisher).filter(Boolean))

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-[10px] text-[var(--muted)] mb-10 font-mono uppercase tracking-[0.2em]">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">Compare</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter leading-none mb-6">
          {comp.a} <span className="text-[var(--muted)]">vs</span>{' '}
          <span className="text-[var(--accent)]">{comp.b}</span>
        </h1>
      </div>

      {/* Side by side stats summary */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="border-2 border-[var(--border)] p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-3">
            {comp.a}
          </h2>
          <p className="text-3xl font-black">{formatNumber(statsA.length)}</p>
          <p className="text-xs text-[var(--muted)] mt-1">
            statistics from {publishersA.size} sources
          </p>
        </div>
        <div className="border-2 border-[var(--border)] p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-3">
            {comp.b}
          </h2>
          <p className="text-3xl font-black">{formatNumber(statsB.length)}</p>
          <p className="text-xs text-[var(--muted)] mt-1">
            statistics from {publishersB.size} sources
          </p>
        </div>
      </div>

      {/* Two columns of stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Latest {comp.a}
            </h2>
            <div className="flex-1 border-t-2 border-[var(--border)]" />
          </div>
          {statsA.slice(0, 15).map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
          <Link
            href={`/threats/${slugify(comp.a)}`}
            className="inline-block mt-4 border-2 border-[var(--border)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
          >
            View all {comp.a} &rarr;
          </Link>
        </div>
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Latest {comp.b}
            </h2>
            <div className="flex-1 border-t-2 border-[var(--border)]" />
          </div>
          {statsB.slice(0, 15).map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
          <Link
            href={`/threats/${slugify(comp.b)}`}
            className="inline-block mt-4 border-2 border-[var(--border)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
          >
            View all {comp.b} &rarr;
          </Link>
        </div>
      </div>

      {/* Other comparisons */}
      <div className="mt-16">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
            Other Comparisons
          </h2>
          <div className="flex-1 border-t-2 border-[var(--border)]" />
        </div>
        <div className="flex flex-wrap gap-2">
          {COMPARISONS.filter((c) => makeSlug(c.a, c.b) !== slug).map((c) => (
            <Link
              key={makeSlug(c.a, c.b)}
              href={`/compare/${makeSlug(c.a, c.b)}`}
              className="border-2 border-[var(--border)] px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] hover:border-[var(--accent)] transition-colors"
            >
              {c.a} vs {c.b}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
