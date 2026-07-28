'use client'

import { useState, useEffect, useRef } from 'react'

export default function NewsletterPopup() {
  const [show, setShow] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoaded = useRef(false)

  useEffect(() => {
    if (localStorage.getItem('newsletter_dismissed')) return

    const timer = setTimeout(() => setShow(true), 15000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!show || scriptLoaded.current || !containerRef.current) return

    containerRef.current.innerHTML = ''
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/ghost/signup-form@~0.3/umd/signup-form.min.js'
    script.async = true
    // The embed takes its colours from these, so they have to be set here to
    // match the site. No icon: the stock chart image is the last piece of the
    // old palette left anywhere on the site.
    script.dataset.backgroundColor = '#ffffff'
    script.dataset.textColor = '#000000'
    script.dataset.buttonColor = '#000000'
    script.dataset.buttonTextColor = '#ffffff'
    script.dataset.title = 'Cybersecurity Statistics'
    script.dataset.description = 'Weekly cybersecurity statistics by email.'
    script.dataset.site = 'https://www.cybersecstats.com/'
    script.dataset.locale = 'en'
    containerRef.current.appendChild(script)
    scriptLoaded.current = true
  }, [show])

  function dismiss() {
    setShow(false)
    localStorage.setItem('newsletter_dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={dismiss} />
      <div className="relative bg-[var(--background)] border border-[var(--border)] max-w-md w-full">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-sm text-[var(--muted)] hover:text-[var(--foreground)] z-10 bg-[var(--background)] px-2 py-1"
          aria-label="Close"
        >
          Close
        </button>
        <div ref={containerRef} style={{ height: '40vmin', minHeight: 360 }} />
      </div>
    </div>
  )
}
