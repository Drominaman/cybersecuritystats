import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Get weekly cybersecurity statistics delivered to your inbox.',
}

export default function NewsletterPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-[10px] text-[var(--muted)] mb-10 font-mono uppercase tracking-[0.2em]">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">Newsletter</span>
      </nav>

      <h1 className="text-4xl font-black tracking-tighter leading-none mb-4">
        Newsletter
      </h1>
      <p className="text-[var(--muted)] mb-8">
        Weekly cybersecurity statistics from the latest industry reports. No fluff.
      </p>

      <div className="border-2 border-[var(--border)] p-8 text-center">
        <p className="text-sm text-[var(--muted)]">
          Newsletter signup coming soon. In the meantime, bookmark this site
          or follow us for updates.
        </p>
      </div>
    </div>
  )
}
