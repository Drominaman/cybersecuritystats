import type { Metadata } from 'next'
import Link from 'next/link'
import GhostSignup from '@/components/GhostSignup'
import { getPitchData } from '@/lib/popup-pitch'
import { pitchLine } from '@/lib/pitch-line'

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Get weekly cybersecurity statistics delivered to your inbox.',
}

export default function NewsletterPage() {
  const { total } = getPitchData()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-[var(--muted)] mb-10">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">Newsletter</span>
      </nav>

      <h1 className="text-4xl font-black tracking-tighter leading-none mb-4">
        Newsletter
      </h1>
      <p className="text-[var(--muted)] mb-8">
        Weekly cybersecurity statistics from the latest industry reports. No fluff.
      </p>

      {/* This page carried a "signup coming soon" notice while the popup on
          every other page was already taking addresses. */}
      <div className="border border-[var(--border)]">
        <GhostSignup title="CyberSecStats" description={pitchLine(total, true)} minHeight={380} />
      </div>

      <p className="text-xs text-[var(--muted)] mt-6">
        One email a week. Unsubscribe at any time.
      </p>
    </div>
  )
}
