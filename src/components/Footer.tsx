import Link from 'next/link'
import { getEnabledClusters } from '@/data/clusters'

export default function Footer() {
  const clusters = getEnabledClusters()

  return (
    <footer className="border-t-4 border-[var(--border)] bg-[var(--foreground)] text-[var(--background)]">
      {/* Fat footer with sitemap links */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Industries */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--background)] opacity-50 mb-3">
              Industries
            </p>
            <div className="flex flex-col gap-1.5">
              {clusters.map((c) => (
                <Link
                  key={c.id}
                  href={`/industry/${c.id}`}
                  className="text-sm opacity-70 hover:opacity-100 hover:text-[var(--highlight)]"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Threats */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--background)] opacity-50 mb-3">
              Threats
            </p>
            <div className="flex flex-col gap-1.5">
              {['Ransomware', 'Phishing', 'Data Breach', 'Fraud', 'DDoS', 'Insider Threat'].map((threat) => (
                <Link
                  key={threat}
                  href={`/threats/${threat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm opacity-70 hover:opacity-100 hover:text-[var(--highlight)]"
                >
                  {threat}
                </Link>
              ))}
            </div>
          </div>

          {/* Compare */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--background)] opacity-50 mb-3">
              Compare
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Ransomware vs Phishing', slug: 'ransomware-vs-phishing' },
                { label: 'Ransomware vs Data Breach', slug: 'ransomware-vs-data-breach' },
                { label: 'Fraud vs Phishing', slug: 'fraud-vs-phishing' },
              ].map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="text-sm opacity-70 hover:opacity-100 hover:text-[var(--highlight)]"
                >
                  {comp.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Site */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--background)] opacity-50 mb-3">
              Site
            </p>
            <div className="flex flex-col gap-1.5">
              <Link href="/publishers" className="text-sm opacity-70 hover:opacity-100 hover:text-[var(--highlight)]">Publishers</Link>
              <Link href="/blog" className="text-sm opacity-70 hover:opacity-100 hover:text-[var(--highlight)]">Blog</Link>
              <Link href="/about" className="text-sm opacity-70 hover:opacity-100 hover:text-[var(--highlight)]">About</Link>
              <Link href="/author" className="text-sm opacity-70 hover:opacity-100 hover:text-[var(--highlight)]">Author</Link>
              <Link href="/newsletter" className="text-sm opacity-70 hover:opacity-100 hover:text-[var(--highlight)]">Newsletter</Link>
              <Link href="/privacy" className="text-sm opacity-70 hover:opacity-100 hover:text-[var(--highlight)]">Privacy</Link>
              <Link href="/terms" className="text-sm opacity-70 hover:opacity-100 hover:text-[var(--highlight)]">Terms</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--background)] border-opacity-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] opacity-50">
            CyberSecurityStats.com
          </p>
          <p className="text-xs opacity-40">
            Data sourced from published industry reports. Not affiliated with any vendor.
          </p>
        </div>
      </div>
    </footer>
  )
}
