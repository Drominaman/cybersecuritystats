import Link from 'next/link'
import { getEnabledClusters } from '@/data/clusters'
import { getTotalStatCount, getUniqueReportCount } from '@/lib/queries'
import { slugify } from '@/lib/utils'

export const revalidate = 3600

export default async function HomePage() {
  const clusters = getEnabledClusters()
  const [totalStats, reportCount] = await Promise.all([
    getTotalStatCount(),
    getUniqueReportCount(),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="mb-20">
        <h1 className="text-6xl font-black tracking-tighter leading-none mb-6">
          Cybersecurity<br />
          <span className="text-[var(--accent)]">Statistics</span>
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-xl">
          <span className="font-mono text-2xl font-black text-[var(--foreground)]">
            {totalStats.toLocaleString()}
          </span>{' '}
          data points from {reportCount.toLocaleString()} reports. Organized by industry and threat type.
        </p>
      </div>

      {/* Matrix Grid */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Industry &times; Threat Matrix
          </h2>
          <div className="flex-1 border-t-2 border-[var(--border)]" />
        </div>

        <div className="space-y-4">
          {clusters.map((cluster) => (
            <div
              key={cluster.id}
              className="border-2 border-[var(--border)] p-5 hover:bg-[var(--surface)] transition-colors"
            >
              <Link
                href={`/industry/${cluster.id}`}
                className="text-lg font-black uppercase tracking-tight hover:text-[var(--accent)]"
              >
                {cluster.label}
              </Link>
              <div className="mt-3 flex flex-wrap gap-2">
                {cluster.threats.map((threat) => (
                  <Link
                    key={threat}
                    href={`/industry/${cluster.id}/${slugify(threat)}`}
                    className="inline-block border-2 border-[var(--border)] px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] hover:border-[var(--accent)] transition-colors"
                  >
                    {threat}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="border-t-2 border-[var(--border)] pt-8">
        <p className="text-sm text-[var(--muted)] max-w-xl">
          We aggregate cybersecurity statistics from published industry reports
          and organize them by sector and attack type. Every stat links to its
          original source.
        </p>
      </div>
    </div>
  )
}
