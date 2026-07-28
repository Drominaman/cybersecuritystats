import Link from 'next/link'

const LINKS: [string, string][] = [
  ['/industry/healthcare', 'Industries'],
  ['/threats/ransomware', 'Threats'],
  ['/compare/ransomware-vs-phishing', 'Compare'],
  ['/publishers', 'Publishers'],
  ['/blog', 'Blog'],
  ['/about', 'About'],
]

export default function Nav() {
  return (
    <nav className="sticky top-0 z-40 bg-[var(--background)] border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-base font-bold shrink-0">
          Cybersecurity Statistics
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="px-2.5 py-1.5 hover:underline">
              {label}
            </Link>
          ))}
          <Link
            href="/newsletter"
            className="ml-2 px-3.5 py-1.5 bg-[var(--accent-bg)] text-[var(--accent-fg)]"
          >
            Get the newsletter
          </Link>
        </div>

        {/* Mobile — condensed to the three entry points that matter */}
        <div className="flex md:hidden items-center gap-3 text-sm">
          <Link href="/industry/healthcare" className="hover:underline">Industries</Link>
          <Link href="/threats/ransomware" className="hover:underline">Threats</Link>
          <Link href="/publishers" className="hover:underline">Publishers</Link>
        </div>
      </div>
    </nav>
  )
}
