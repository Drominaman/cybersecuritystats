'use client'

import { useEffect, useRef } from 'react'

// The newsletter branding rather than the site's black and white, so the form
// reads as the newsletter it signs you up to. The button label is black: white
// on this amber is 1.8:1, black is 11.6:1.
const BRAND = {
  background: '#08090c',
  text: '#FFFFFF',
  button: '#ffb219',
  buttonText: '#000000',
  icon: 'https://storage.ghost.io/c/c0/17/c01762e7-1ff7-42b5-be72-9498adb5e3f5/content/images/size/w192h192/2025/01/Slide-4_3---2.png',
  site: 'https://www.cybersecstats.com/',
}

/**
 * The Ghost signup form, used by the popup and by /newsletter.
 *
 * The embed is a script that replaces its own container, so it cannot be
 * written as ordinary markup and has to be appended after mount.
 */
export default function GhostSignup({
  title,
  description,
  minHeight = 360,
}: {
  title: string
  description: string
  minHeight?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current || !containerRef.current) return

    containerRef.current.innerHTML = ''
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/ghost/signup-form@~0.3/umd/signup-form.min.js'
    script.async = true
    script.dataset.backgroundColor = BRAND.background
    script.dataset.textColor = BRAND.text
    script.dataset.buttonColor = BRAND.button
    script.dataset.buttonTextColor = BRAND.buttonText
    script.dataset.title = title
    script.dataset.description = description
    script.dataset.icon = BRAND.icon
    script.dataset.site = BRAND.site
    script.dataset.locale = 'en'
    containerRef.current.appendChild(script)
    loaded.current = true
  }, [title, description])

  // The container carries the embed's own background colour. Left transparent,
  // it flashes a blank card for as long as the Ghost iframe takes to paint.
  return (
    <div
      ref={containerRef}
      style={{ minHeight, background: BRAND.background }}
    />
  )
}
