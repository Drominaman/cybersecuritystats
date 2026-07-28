import Link from 'next/link'
import { getEnabledClusters } from '@/data/clusters'

const THREATS = ['Ransomware', 'Phishing', 'Data Breach', 'Fraud', 'DDoS', 'Insider Threat']

const COMPARISONS: [string, string][] = [
  ['ransomware-vs-phishing', 'Ransomware vs Phishing'],
  ['ransomware-vs-data-breach', 'Ransomware vs Data Breach'],
  ['fraud-vs-phishing', 'Fraud vs Phishing'],
]

const SITE: [string, string][] = [
  ['/publishers', 'Publishers'],
  ['/blog', 'Blog'],
  ['/about', 'About'],
  ['/author', 'Author'],
  ['/newsletter', 'Newsletter'],
  ['/privacy', 'Privacy'],
  ['/terms', 'Terms'],
]

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-bold mb-2">{title}</p>
      <div className="flex flex-col gap-1.5 text-sm">{children}</div>
    </div>
  )
}

export default function Footer() {
  const clusters = getEnabledClusters()

  return (
    <footer className="border-t border-[var(--border)] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Column title="Industries">
            {clusters.map((c) => (
              <Link key={c.id} href={`/industry/${c.id}`} className="underline">
                {c.label}
              </Link>
            ))}
          </Column>

          <Column title="Threats">
            {THREATS.map((threat) => (
              <Link
                key={threat}
                href={`/threats/${threat.toLowerCase().replace(/\s+/g, '-')}`}
                className="underline"
              >
                {threat}
              </Link>
            ))}
          </Column>

          <Column title="Compare">
            {COMPARISONS.map(([slug, label]) => (
              <Link key={slug} href={`/compare/${slug}`} className="underline">
                {label}
              </Link>
            ))}
          </Column>

          <Column title="Site">
            {SITE.map(([href, label]) => (
              <Link key={href} href={href} className="underline">
                {label}
              </Link>
            ))}
          </Column>
        </div>
      </div>

      <div className="border-t border-[var(--border-light)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-[var(--muted)]">
          <p>Cybersecurity Statistics</p>
          <p>Data sourced from published industry reports. Not affiliated with any vendor.</p>
        </div>
      </div>
    </footer>
  )
}
