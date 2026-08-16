import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for CyberSecurityStats.com.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-[var(--muted)] mb-10 text-xs">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">Terms</span>
      </nav>

      <h1 className="text-4xl font-black tracking-tighter leading-none mb-8">
        Terms of Use
      </h1>

      <div className="space-y-6 text-[15px] leading-relaxed">
        <p className="text-sm text-[var(--muted)]">Last updated: July 2026</p>

        <h2 className="text-lg font-black mt-8">Use of Data</h2>
        <p>
          The statistics on CyberSecurityStats.com are aggregated from publicly
          available industry reports. Each statistic is attributed to its original
          publisher and includes a link to the source material.
        </p>

        <h2 className="text-lg font-black mt-8">Attribution</h2>
        <p>
          You may cite statistics from this site provided you attribute both the
          original publisher (e.g., "Source: IBM, Cost of a Data Breach Report 2025")
          and CyberSecurityStats.com as the aggregation platform.
        </p>

        <h2 className="text-lg font-black mt-8">No Warranty</h2>
        <p>
          Data is provided "as is" without warranty. While we strive for accuracy,
          we recommend verifying statistics against the original source before
          making business decisions. We are not responsible for errors in the
          original source material.
        </p>

        <h2 className="text-lg font-black mt-8">Intellectual Property</h2>
        <p>
          The statistics themselves belong to their respective publishers. The
          organization, classification, and presentation of data on this site is
          the intellectual property of CyberSecurityStats.com.
        </p>

        <h2 className="text-lg font-black mt-8">Changes</h2>
        <p>
          We may update these terms from time to time. Continued use of the site
          constitutes acceptance of the updated terms.
        </p>
      </div>
    </div>
  )
}
