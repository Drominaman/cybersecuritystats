import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Laura Martisiute — Editor',
  description: 'Laura Martisiute is the editor of CyberSecurityStats. She researches and curates cybersecurity statistics from industry reports.',
}

const AUTHOR = {
  name: 'Laura Martisiute',
  role: 'Editor',
  linkedin: 'https://www.linkedin.com/in/lauramartisiute/',
  bio: [
    'Laura Martisiute is the editor of CyberSecurityStats, where she researches, curates, and organizes cybersecurity statistics from published industry reports.',
    'With a background in cybersecurity content and research, Laura tracks how threats like ransomware, phishing, and fraud are evolving across industries — from healthcare to financial services.',
    'Her work focuses on making cybersecurity data accessible and verifiable. Every statistic on this site is attributed to its original source with a direct link to the report.',
  ],
}

function authorSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR.name,
    jobTitle: AUTHOR.role,
    worksFor: {
      '@type': 'Organization',
      name: 'CyberSecurityStats',
      url: 'https://cybersecuritystats.com',
    },
    sameAs: [AUTHOR.linkedin],
    url: 'https://cybersecuritystats.com/author',
  }
}

export default function AuthorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <JsonLd data={authorSchema()} />

      <nav className="text-xs text-[var(--muted)] mb-10 text-xs">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">Author</span>
      </nav>

      <div className="flex items-start gap-6 mb-10">
        {/* Initials avatar */}
        <div className="shrink-0 w-20 h-20 border border-[var(--border)] bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center text-2xl font-black">
          LM
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tighter leading-none">
            {AUTHOR.name}
          </h1>
          <p className="text-xs text-[var(--muted)] mt-2">
            {AUTHOR.role}
          </p>
          <a
            href={AUTHOR.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 border border-[var(--border)] px-3 py-1.5 text-xs font-bold hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
          >
            LinkedIn &rarr;
          </a>
        </div>
      </div>

      <div className="space-y-4 text-[15px] leading-relaxed">
        {AUTHOR.bio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="border-t border-[var(--border)] mt-12 pt-8">
        <h2 className="text-xs text-[var(--muted)] mb-4">
          Coverage Areas
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            'Healthcare Cybersecurity',
            'Financial Services Security',
            'Ransomware',
            'Phishing',
            'Data Breaches',
            'AI Threats',
            'Fraud Statistics',
            'Cyber Insurance',
          ].map((topic) => (
            <span
              key={topic}
              className="inline-block border border-[var(--border)] px-3 py-1.5 text-xs font-bold"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
