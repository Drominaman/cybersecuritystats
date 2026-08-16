'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import GhostSignup from '@/components/GhostSignup'
import { pitchLine } from '@/lib/pitch-line'
import type { PitchData, Pitch } from '@/lib/popup-pitch'

// Match the popup's pitch to the page it interrupts. A reader on the ransomware
// page is told how many ransomware statistics are in the set, from how many
// sources, rather than being given the same general claim as everyone else.
function pitchFor(pathname: string, data: PitchData): { pitch: Pitch; isTotal: boolean } {
  const threat = pathname.match(/^\/threats\/([^/]+)/)
  if (threat && data.threats[threat[1]]) return { pitch: data.threats[threat[1]], isTotal: false }

  const industry = pathname.match(/^\/industry\/([^/]+)/)
  if (industry && data.industries[industry[1]]) {
    return { pitch: data.industries[industry[1]], isTotal: false }
  }

  return { pitch: data.total, isTotal: true }
}

export default function NewsletterPopup({ pitch }: { pitch: PitchData }) {
  const [show, setShow] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (localStorage.getItem('newsletter_dismissed')) return

    const timer = setTimeout(() => setShow(true), 30000)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setShow(false)
    localStorage.setItem('newsletter_dismissed', '1')
  }

  if (!show) return null

  const { pitch: p, isTotal } = pitchFor(pathname, pitch)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={dismiss} />
      <div className="relative bg-[#08090c] border border-[var(--border)] max-w-md w-full">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-sm text-white/70 hover:text-white z-10 px-2 py-1"
          aria-label="Close"
        >
          Close
        </button>
        <GhostSignup title="CyberSecStats" description={pitchLine(p, isTotal)} />
      </div>
    </div>
  )
}
