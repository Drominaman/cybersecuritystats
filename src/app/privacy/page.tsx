import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for CyberSecurityStats.com.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-[var(--muted)] mb-10 text-xs">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">Privacy</span>
      </nav>

      <h1 className="text-4xl font-black tracking-tighter leading-none mb-8">
        Privacy Policy
      </h1>

      <div className="space-y-6 text-[15px] leading-relaxed">
        <p className="text-sm text-[var(--muted)]">Last updated: July 2026</p>

        <h2 className="text-lg font-black mt-8">What We Collect</h2>
        <p>
          CyberSecurityStats.com collects minimal data. We measure page views and
          referral sources to understand how the site is used. We do not collect
          personal information unless you provide it, for example by subscribing to
          the newsletter.
        </p>

        <h2 className="text-lg font-black mt-8">Analytics</h2>
        <p>
          We use two analytics tools, and they behave differently.
        </p>
        <p className="mt-3">
          <strong>Plausible Analytics</strong> counts page views and referral sources.
          It sets no cookies, stores nothing on your device, and does not track you
          across websites or build a profile of you.
        </p>
        <p className="mt-3">
          <strong>Microsoft Clarity</strong> records how pages are used, including
          clicks, scrolling and mouse movement, so we can find broken layouts. It
          stores identifiers on your device and Microsoft may use the data in
          accordance with its own privacy policy.
        </p>

        <h2 className="text-lg font-black mt-8">Cookies</h2>
        <p>
          We use essential cookies required for site functionality, and Microsoft
          Clarity stores identifiers on your device as described above. No advertising
          cookies are used and we do not sell advertising.
        </p>

        <h2 className="text-lg font-black mt-8">Third-Party Services</h2>
        <p>
          We use Netlify for hosting, Supabase for our database, Ghost for the
          newsletter, and the analytics tools named above. These services may process
          requests in accordance with their own privacy policies.
        </p>

        <h2 className="text-lg font-black mt-8">Your Data</h2>
        <p>
          We do not sell, trade, or rent your personal information. If you have
          questions about your data, contact us at hello@cybersecuritystats.com.
        </p>

        <h2 className="text-lg font-black mt-8">Changes</h2>
        <p>
          We may update this policy from time to time. Changes will be posted on this page
          with an updated revision date.
        </p>
      </div>
    </div>
  )
}
