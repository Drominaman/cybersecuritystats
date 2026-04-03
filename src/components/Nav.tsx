import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="border-b-4 border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-mono text-xs font-black uppercase tracking-[0.15em]">
          CyberSecurityStats
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/industry/healthcare"
            className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium"
          >
            Industries
          </Link>
          <Link
            href="/threats/ransomware"
            className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium"
          >
            Threats
          </Link>
          <Link
            href="/compare/ransomware-vs-phishing"
            className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium"
          >
            Compare
          </Link>
          <Link
            href="/publishers"
            className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium"
          >
            Publishers
          </Link>
          <Link
            href="/about"
            className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}
