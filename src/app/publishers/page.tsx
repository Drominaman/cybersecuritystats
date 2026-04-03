import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPublishers } from '@/lib/queries'
import { slugify, formatNumber } from '@/lib/utils'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Publishers',
  description: 'Browse cybersecurity statistics by publisher. 400+ research firms, vendors, and industry bodies.',
}

export default async function PublishersPage() {
  const publishers = await getAllPublishers()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-[10px] text-[var(--muted)] mb-10 font-mono uppercase tracking-[0.2em]">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">Publishers</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter leading-none mb-3">
          Publishers
        </h1>
        <p className="text-[var(--muted)] mt-4">
          {formatNumber(publishers.length)} research firms, vendors, and industry bodies.
        </p>
      </div>

      <div className="border-2 border-[var(--border)] divide-y-2 divide-[var(--border)]">
        {publishers.map((pub) => (
          <Link
            key={pub.publisher}
            href={`/publishers/${slugify(pub.publisher)}`}
            className="flex items-center justify-between p-3 hover:bg-[var(--surface)] transition-colors"
          >
            <span className="text-sm font-bold">{pub.publisher}</span>
            <span className="font-mono text-xs text-[var(--muted)]">
              {pub.count} stats
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
