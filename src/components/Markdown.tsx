import type { ReactElement, ReactNode } from 'react'
import { slugify } from '@/lib/utils'

/**
 * Renders the subset of markdown the blog posts actually use:
 * h2/h3 headings, bullet lists, bold, and links. Heading ids are slugified
 * so the in-post tables of contents resolve.
 */

function renderBold(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(\*\*.*?\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${keyPrefix}-b${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      part
    )
  )
}

// The post content is machine-generated, so hrefs are data, not code: only
// web URLs, site paths, and in-page anchors may become links. Anything else
// (javascript:, data:, etc.) renders as plain text.
function safeHref(href: string): string | null {
  if (/^https?:\/\//i.test(href) || href.startsWith('/') || href.startsWith('#')) return href
  return null
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = []
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
  let cursor = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > cursor) {
      parts.push(...renderBold(text.slice(cursor, match.index), `${keyPrefix}-${i}`))
    }

    const [, label, rawHref] = match
    const href = safeHref(rawHref)
    if (href === null) {
      parts.push(...renderBold(label, `${keyPrefix}-${i++}`))
      cursor = match.index + match[0].length
      continue
    }
    const isAnchor = href.startsWith('#')
    parts.push(
      <a
        key={`${keyPrefix}-l${i++}`}
        href={href}
        {...(isAnchor ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        className="underline"
      >
        {label}
      </a>
    )
    cursor = match.index + match[0].length
  }

  if (cursor < text.length) {
    parts.push(...renderBold(text.slice(cursor), `${keyPrefix}-${i}`))
  }

  return parts
}

export default function Markdown({ content }: { content: string }) {
  const blocks: ReactElement[] = []
  let listItems: string[] = []
  let key = 0

  const flushList = () => {
    if (listItems.length === 0) return
    const items = listItems
    listItems = []
    blocks.push(
      <ul key={key++} className="list-disc pl-5 mb-6 space-y-2 marker:text-[var(--muted)]">
        {items.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {renderInline(item, `li-${key}-${i}`)}
          </li>
        ))}
      </ul>
    )
  }

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim()

    if (line.startsWith('### ')) {
      flushList()
      const text = line.slice(4)
      blocks.push(
        <h3
          key={key++}
          id={slugify(text)}
          className="text-lg font-black tracking-tight mt-8 mb-3 scroll-mt-24"
        >
          {text}
        </h3>
      )
    } else if (line.startsWith('## ')) {
      flushList()
      const text = line.slice(3)
      blocks.push(
        <h2
          key={key++}
          id={slugify(text)}
          className="text-2xl font-black tracking-tighter mt-12 mb-4 pb-2 border-b border-[var(--border)] scroll-mt-24"
        >
          {text}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      flushList()
      const text = line.slice(2)
      blocks.push(
        <h2
          key={key++}
          id={slugify(text)}
          className="text-2xl font-black tracking-tighter mt-12 mb-4 pb-2 border-b border-[var(--border)] scroll-mt-24"
        >
          {text}
        </h2>
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(line.slice(2))
    } else if (line) {
      flushList()
      blocks.push(
        <p key={key++} className="leading-relaxed mb-5">
          {renderInline(line, `p-${key}`)}
        </p>
      )
    } else {
      flushList()
    }
  }

  flushList()

  return <div className="text-[15px]">{blocks}</div>
}
