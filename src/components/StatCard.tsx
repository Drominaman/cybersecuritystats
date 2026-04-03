import type { Stat } from '@/types'
import { formatDate } from '@/lib/utils'

export default function StatCard({ stat }: { stat: Stat }) {
  const tags = [stat.tag1, stat.tag2, stat.tag3, stat.tag4, stat.tag5].filter(Boolean)

  return (
    <div className="border-b-2 border-[var(--border)] py-5">
      <p className="text-[15px] leading-relaxed font-medium">{stat.title}</p>
      <div className="mt-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
        <span className="bg-[var(--foreground)] text-[var(--background)] px-2 py-0.5 text-[10px] font-bold">
          {stat.publisher}
        </span>
        <span>{stat.source_name}</span>
        {stat.published_on && (
          <>
            <span>&middot;</span>
            <span>{formatDate(stat.published_on)}</span>
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
