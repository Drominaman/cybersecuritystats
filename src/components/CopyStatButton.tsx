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
      className="text-xs text-[var(--muted)] hover:underline transition-colors"
      title="Copy stat with source link"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
