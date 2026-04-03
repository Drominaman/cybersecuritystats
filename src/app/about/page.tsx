import type { Metadata } from 'next'
import Link from 'next/link'
import { getTotalStatCount, getUniqueReportCount, getAllPublishers } from '@/lib/static-data'

export const metadata: Metadata = {
  title: 'About',
  description: 'How CyberSecurityStats aggregates and organizes cybersecurity data from published industry reports.',
}

export const revalidate = 86400

export default async function AboutPage() {
  const [totalStats, reportCount, publishers] = await Promise.all([
    getTotalStatCount(),
    getUniqueReportCount(),
    getAllPublishers(),
  ])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-[10px] text-[var(--muted)] mb-10 font-mono uppercase tracking-[0.2em]">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">About</span>
      </nav>

      <h1 className="text-4xl font-black tracking-tighter leading-none mb-8">
        About
      </h1>

      <div className="space-y-6 text-[15px] leading-relaxed">
        <p>
          CyberSecurityStats is a research tool that aggregates cybersecurity
          statistics from published industry reports and organizes them by
          industry sector and threat type.
        </p>

        <p>
          We currently index <strong>{totalStats.toLocaleString()} data points</strong> from{' '}
          <strong>{reportCount.toLocaleString()} reports</strong> published by{' '}
          <strong>{publishers.length} organizations</strong> including research firms,
          security vendors, government agencies, and industry bodies.
        </p>

        <div className="border-2 border-[var(--border)] p-5 my-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
            Methodology
          </h2>
          <div className="space-y-4 text-sm">
            <p>
              <strong>Sources.</strong> We collect statistics from publicly available
              cybersecurity research reports, surveys, and data publications. Each
              statistic is attributed to its original publisher and report, with a
              direct link to the source material.
            </p>
            <p>
              <strong>Classification.</strong> Statistics are tagged with up to five
              topic labels. We classify these tags into facets (industry, threat type,
              technology, geography) to enable the industry-by-threat matrix navigation.
            </p>
            <p>
              <strong>Currency.</strong> Data is updated as new reports are published.
              Each statistic carries its publication date so users can assess recency.
            </p>
            <p>
              <strong>Editorial policy.</strong> We do not editorialize, interpret, or
              modify the statistics. The data is presented as published by the original
              source. Where multiple sources report different numbers for the same metric,
              all figures are included.
            </p>
          </div>
        </div>

        <div className="border-2 border-[var(--border)] p-5 my-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
            How to Use This Data
          </h2>
          <div className="space-y-4 text-sm">
            <p>
              <strong>Industry research.</strong> Browse{' '}
              <Link href="/industry/healthcare" className="text-[var(--accent)] hover:underline">
                Healthcare
              </Link>{' '}
              or{' '}
              <Link href="/industry/financial-services" className="text-[var(--accent)] hover:underline">
                Financial Services
              </Link>{' '}
              to see cybersecurity data specific to your sector.
            </p>
            <p>
              <strong>Threat analysis.</strong> Drill into specific threat types like{' '}
              <Link href="/threats/ransomware" className="text-[var(--accent)] hover:underline">
                Ransomware
              </Link>{' '}
              or{' '}
              <Link href="/threats/phishing" className="text-[var(--accent)] hover:underline">
                Phishing
              </Link>{' '}
              to understand frequency, cost, and trends.
            </p>
            <p>
              <strong>Cross-reference.</strong> Matrix pages like{' '}
              <Link href="/industry/healthcare/ransomware" className="text-[var(--accent)] hover:underline">
                Healthcare Ransomware
              </Link>{' '}
              combine both dimensions, showing only statistics relevant to that
              specific intersection.
            </p>
            <p>
              <strong>Source verification.</strong> Every statistic links back to
              its original report. We encourage users to verify data against the
              primary source before citing.
            </p>
          </div>
        </div>

        <p className="text-sm text-[var(--muted)]">
          For questions or corrections, contact us at{' '}
          <span className="text-[var(--foreground)]">hello@cybersecuritystats.com</span>
        </p>
      </div>
    </div>
  )
}
