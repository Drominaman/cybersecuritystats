'use client'

import { useState } from 'react'

export default function CopyStatButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
      title="Copy stat with source link"
    >
      {copied ? 'COPIED' : 'COPY'}
    </button>
  )
}
