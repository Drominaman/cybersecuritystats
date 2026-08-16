'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import type { PitchData, Pitch } from '@/lib/popup-pitch'

// Match the popup's pitch to the page it interrupts. A reader on the ransomware
// page is told how many ransomware statistics are in the set, from how many
// reports, rather than being given the same general claim as everyone else.
function pitchFor(pathname: string, data: PitchData): Pitch {
  const threat = pathname.match(/^\/threats\/([^/]+)/)
  if (threat && data.threats[threat[1]]) return data.threats[threat[1]]

  const industry = pathname.match(/^\/industry\/([^/]+)/)
  if (industry && data.industries[industry[1]]) return data.industries[industry[1]]

  return data.total
}

export default function NewsletterPopup({ pitch }: { pitch: PitchData }) {
  const [show, setShow] = useState(false)
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoaded = useRef(false)

  useEffect(() => {
    if (localStorage.getItem('newsletter_dismissed')) return

    const timer = setTimeout(() => setShow(true), 30000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!show || scriptLoaded.current || !containerRef.current) return

    containerRef.current.innerHTML = ''
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/ghost/signup-form@~0.3/umd/signup-form.min.js'
    script.async = true
    // The embed takes its colours from these. They match the CyberSecStats
    // newsletter branding rather than the site's black and white, so the popup
    // reads as the newsletter it signs you up to.
    script.dataset.backgroundColor = '#08090c'
    script.dataset.textColor = '#FFFFFF'
    script.dataset.buttonColor = '#ffb219'
    script.dataset.buttonTextColor = '#000000'
    const p = pitchFor(pathname, pitch)
    const subject = p === pitch.total ? 'cybersecurity statistics' : `${p.label.toLowerCase()} statistics`
    script.dataset.title = 'CyberSecStats'
    script.dataset.description =
      `${p.stats.toLocaleString()} ${subject} from ${p.sources.toLocaleString()} ` +
      `${p === pitch.total ? 'reports' : 'sources'}, each linked to the report it came from. ` +
      'New figures every week.'
    script.dataset.icon =
      'https://storage.ghost.io/c/c0/17/c01762e7-1ff7-42b5-be72-9498adb5e3f5/content/images/size/w192h192/2025/01/Slide-4_3---2.png'
    script.dataset.site = 'https://www.cybersecstats.com/'
    script.dataset.locale = 'en'
    containerRef.current.appendChild(script)
    scriptLoaded.current = true
  }, [show, pathname, pitch])

  function dismiss() {
    setShow(false)
    localStorage.setItem('newsletter_dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={dismiss} />
      {/* The panel carries the embed's own background colour. Left white, it
          flashed a blank card for as long as the Ghost iframe took to paint. */}
      <div className="relative bg-[#08090c] border border-[var(--border)] max-w-md w-full">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-sm text-white/70 hover:text-white z-10 px-2 py-1"
          aria-label="Close"
        >
          Close
        </button>
        <div ref={containerRef} style={{ height: '40vmin', minHeight: 360 }} />
      </div>
    </div>
  )
}
