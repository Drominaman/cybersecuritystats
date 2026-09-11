import type { Metadata } from 'next'
import Link from 'next/link'
import { publishedBenchmarks, figureStats } from '@/lib/benchmarks'
import { JsonLd, breadcrumbSchema } from '@/components/JsonLd'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Cybersecurity Benchmarks: One Question, Every Source',
  description:
    'What share of organisations were hit by ransomware, run awareness training, or have an AI governance policy? Each benchmark gathers every report that answers the same question, so you get a range and a median instead of one vendor’s number.',
  alternates: { canonical: '/benchmarks' },
}

export default async function BenchmarksPage() {
  const benchmarks = await publishedBenchmarks()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://cybersecuritystats.com' },
        { name: 'Benchmarks', url: 'https://cybersecuritystats.com/benchmarks' },
      ])} />
      <nav className="text-xs text-[var(--muted)] mb-10">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">Benchmarks</span>
      </nav>

      <div className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-black tracking-tighter leading-none mb-4">Cybersecurity Benchmarks</h1>
        <p className="text-base leading-relaxed">
          A single report gives you one number. A benchmark gathers every report that answers the same
          question, so you get the range and the median, and can see where any one figure sits. Every
          figure was checked by hand against its source before it was included.
        </p>
      </div>

      <div className="border border-[var(--border)] divide-y divide-[var(--border)]">
        {benchmarks.map((b) => {
          const s = figureStats(b.approved)
          return (
            <Link key={b.id} href={`/benchmarks/${b.id}`} className="flex items-baseline justify-between gap-6 px-4 py-4 hover:bg-[var(--foreground)] hover:text-[var(--background)] group">
              <span className="text-sm font-bold">{b.question}</span>
              <span className="text-xs whitespace-nowrap text-[var(--muted)] group-hover:text-[var(--background)]">
                median {s.median}% · {s.min}%–{s.max}% · {s.n} sources
              </span>
            </Link>
          )
        })}
      </div>

      <p className="text-xs text-[var(--muted)] mt-6 max-w-3xl">
        Benchmarks are added as reports are reviewed. To cite one in APA, MLA or Chicago, export the
        figures, or be told when a median moves, see{' '}
        <a href="https://app.cybersecstats.com/#view=benchmarks" className="underline">CyberSecStats Pro</a>.
      </p>
    </div>
  )
}
