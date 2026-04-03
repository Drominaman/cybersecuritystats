import Link from 'next/link'
import { getEnabledClusters } from '@/data/clusters'

export default function Nav() {
  const clusters = getEnabledClusters()

  return (
    <nav className="border-b-4 border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-mono text-xs font-black uppercase tracking-[0.15em]">
          CyberSecurityStats
        </Link>
        <div className="flex gap-1">
          {clusters.map((c) => (
            <Link
              key={c.id}
              href={`/industry/${c.id}`}
              className="font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border-2 border-[var(--border)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
            >
              {c.label}
            </Link>
          ))}
          <Link
            href="/publishers"
            className="font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border-2 border-[var(--border)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
          >
            Publishers
          </Link>
        </div>
      </div>
    </nav>
  )
}
