import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="border-b-4 border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-mono text-xs font-black uppercase tracking-[0.15em] shrink-0">
          CyberSecurityStats
        </Link>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/industry/healthcare" className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium">
            Industries
          </Link>
          <Link href="/threats/ransomware" className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium">
            Threats
          </Link>
          <Link href="/compare/ransomware-vs-phishing" className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium">
            Compare
          </Link>
          <Link href="/publishers" className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium">
            Publishers
          </Link>
          <Link href="/blog" className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium">
            Blog
          </Link>
          <Link href="/about" className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium">
            About
          </Link>
        </div>
        {/* Mobile nav — condensed */}
        <div className="flex md:hidden items-center gap-4 text-xs">
          <Link href="/industry/healthcare" className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium">
            Industries
          </Link>
          <Link href="/threats/ransomware" className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium">
            Threats
          </Link>
          <Link href="/publishers" className="text-[var(--muted)] hover:text-[var(--foreground)] font-medium">
            More
          </Link>
        </div>
      </div>
    </nav>
  )
}
