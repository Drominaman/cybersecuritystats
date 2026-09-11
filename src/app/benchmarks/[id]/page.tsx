import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { publishedBenchmarks, figureStats } from '@/lib/benchmarks'
import { JsonLd, breadcrumbSchema } from '@/components/JsonLd'
import SourceScatter from '@/components/SourceScatter'

export const revalidate = 3600
export const dynamicParams = true

interface Props { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return (await publishedBenchmarks()).map((b) => ({ id: b.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const b = (await publishedBenchmarks()).find((x) => x.id === id)
  if (!b) return {}
  const s = figureStats(b.approved)
  const title = b.question.replace(/\?$/, '')
  const description = `${s.n} reports answer this. The figures run from ${s.min}% to ${s.max}%, with a median of ${s.median}%. Every source linked.`
  return { title, description, openGraph: { title, description }, alternates: { canonical: `/benchmarks/${id}` } }
}

function when(d: string | null) {
  if (!d) return ''
  const t = new Date(d)
  return isNaN(t.getTime()) ? '' : t.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

export default async function BenchmarkPage({ params }: Props) {
  const { id } = await params
  const all = await publishedBenchmarks()
  const b = all.find((x) => x.id === id)
  if (!b) notFound()

  const s = figureStats(b.approved)
  const rows = [...b.approved].sort((x, y) => x.value - y.value)
  const others = all.filter((x) => x.id !== b.id)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://cybersecuritystats.com' },
        { name: 'Benchmarks', url: 'https://cybersecuritystats.com/benchmarks' },
        { name: b.question, url: `https://cybersecuritystats.com/benchmarks/${b.id}` },
      ])} />
      <nav className="text-xs text-[var(--muted)] mb-10">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/benchmarks" className="hover:underline">Benchmarks</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{b.question}</span>
      </nav>

      <div className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-black tracking-tighter leading-none mb-4">{b.question}</h1>
        <p className="text-lg">
          <b>{s.n} sources</b> put it between <b>{s.min}%</b> and <b>{s.max}%</b>. The median is <b>{s.median}%</b>.
        </p>
        <p className="text-sm text-[var(--muted)] mt-2">
          One figure per publisher, the most recent. Each was checked by hand against the report it came from.
        </p>
      </div>

      <SourceScatter figures={b.approved} median={s.median} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12 mt-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xs text-[var(--muted)]">The sources</h2>
            <div className="flex-1 border-t border-[var(--border)]" />
          </div>
          <table className="w-full text-sm border border-[var(--border)]">
            <thead>
              <tr className="text-left text-xs text-[var(--muted)]">
                <th className="border border-[var(--border)] px-3 py-2 w-16">Figure</th>
                <th className="border border-[var(--border)] px-3 py-2">Statistic</th>
                <th className="border border-[var(--border)] px-3 py-2 w-56">Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="align-top">
                  <td className="border border-[var(--border)] px-3 py-2 font-bold whitespace-nowrap">{r.value}%</td>
                  <td className="border border-[var(--border)] px-3 py-2">{r.stat_title}</td>
                  <td className="border border-[var(--border)] px-3 py-2 text-xs">
                    {r.link ? (
                      <a href={r.link} target="_blank" rel="noopener noreferrer" className="underline">
                        {r.publisher || 'Source'}{r.report ? `, ${r.report}` : ''}
                      </a>
                    ) : (
                      <>{r.publisher || 'Source'}{r.report ? `, ${r.report}` : ''}</>
                    )}
                    {when(r.published_on) ? <span className="text-[var(--muted)]">, {when(r.published_on)}</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="text-sm">
          <h2 className="text-xs text-[var(--muted)] mb-3 pb-2 border-b border-[var(--border)]">Use this benchmark</h2>
          <p className="text-xs leading-relaxed mb-3">
            Cite it in APA, MLA or Chicago, export the figures as CSV, or get a Slack post when the median moves.
          </p>
          <a href={`https://app.cybersecstats.com/#view=benchmarks&qa=${b.id}`} className="inline-block border border-[var(--foreground)] px-3 py-2 text-xs font-bold hover:bg-[var(--foreground)] hover:text-[var(--background)]">
            Open in CyberSecStats Pro →
          </a>

          {others.length > 0 && (
            <>
              <h2 className="text-xs text-[var(--muted)] mt-8 mb-3 pb-2 border-b border-[var(--border)]">Other benchmarks</h2>
              <ul className="space-y-2">
                {others.map((o) => (
                  <li key={o.id}><Link href={`/benchmarks/${o.id}`} className="hover:underline">{o.question}</Link></li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
