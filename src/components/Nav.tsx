import Link from 'next/link'

const LINKS: [string, string][] = [
  ['/industry/healthcare', 'Industries'],
  ['/threats/ransomware', 'Topics'],
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

        {/* Six links plus the button only fit from lg; below that the condensed
            set below takes over rather than letting the button wrap. */}
        <div className="hidden lg:flex items-center gap-1 text-sm">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="px-2.5 py-1.5 hover:underline">
              {label}
            </Link>
          ))}
          <Link
            href="/newsletter"
            className="ml-2 px-3.5 py-1.5 whitespace-nowrap bg-[var(--accent-bg)] text-[var(--accent-fg)]"
          >
            Get the newsletter
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-4 text-sm">
          <Link href="/industry/healthcare" className="hover:underline">Industries</Link>
          <Link href="/threats/ransomware" className="hover:underline">Topics</Link>
          <Link href="/publishers" className="hover:underline">Publishers</Link>
          <Link href="/blog" className="hover:underline">Blog</Link>
        </div>
      </div>
    </nav>
  )
}
