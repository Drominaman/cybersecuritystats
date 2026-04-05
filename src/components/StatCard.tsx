import type { Stat } from '@/types'
import { formatDate, titleCase } from '@/lib/utils'
import CopyStatButton from './CopyStatButton'

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export default function StatCard({ stat }: { stat: Stat }) {
  const tags = [stat.tag1, stat.tag2, stat.tag3, stat.tag4, stat.tag5].filter(Boolean)
  const copyText = `${stat.title} (Source: ${stat.publisher}, ${stat.source_name}) — via cybersecuritystats.com`

  return (
    <div className="border-b-2 border-[var(--border)] py-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[15px] leading-relaxed font-medium">{stat.title}</p>
        <CopyStatButton text={copyText} />
      </div>
      <div className="mt-3 flex items-center flex-wrap gap-x-2 gap-y-1 text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
        <span className="bg-[var(--foreground)] text-[var(--background)] px-2 py-0.5 text-[10px] font-bold">
          {titleCase(stat.publisher)}
        </span>
        {stat.link ? (
          <a
            href={stat.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)] underline decoration-[var(--border-light)]"
          >
            {stat.source_name}
          </a>
        ) : (
          <span>{stat.source_name}</span>
        )}
        {stat.published_on && (
          <>
            <span>&middot;</span>
            <span title={formatDate(stat.published_on)}>{timeAgo(stat.published_on)}</span>
          </>
        )}
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-block border border-[var(--border-light)] px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
