'use client'

import { useState, useEffect, useRef } from 'react'

export default function NewsletterPopup() {
  const [show, setShow] = useState(false)
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
    script.dataset.backgroundColor = '#08090c'
    script.dataset.textColor = '#FFFFFF'
    script.dataset.buttonColor = '#ffb219'
    script.dataset.buttonTextColor = '#000000'
    script.dataset.title = ' CyberSecStats'
    script.dataset.description = 'Fresh, direct cybersecurity statistics, trends and market data. No fluff. '
    script.dataset.icon = 'https://storage.ghost.io/c/c0/17/c01762e7-1ff7-42b5-be72-9498adb5e3f5/content/images/size/w192h192/size/w256h256/2025/01/Slide-4_3---2.png'
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
      <div className="relative bg-[var(--background)] border-4 border-[var(--border)] max-w-md w-full">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 font-mono text-[10px] font-bold text-[var(--muted)] hover:text-[var(--foreground)] z-10 bg-[var(--background)] px-2 py-1"
        >
          CLOSE &times;
        </button>
        <div ref={containerRef} style={{ height: '40vmin', minHeight: 360 }} />
      </div>
    </div>
  )
}
