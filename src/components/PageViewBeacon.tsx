'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Records a page view against our own Netlify function.
 *
 * Sets no cookies and reads nothing from the device, so it counts every
 * visitor rather than only those who accept a consent banner. Fires on route
 * changes too, since the site navigates client-side and those would otherwise
 * never be counted.
 *
 * Canonical copy lives in ~/Development/traffic-dashboard/beacon/client.
 * Edit it there and reinstall rather than editing a site's copy in place.
 */
export default function PageViewBeacon() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return

    // The query string can carry search terms and identifiers. The path is all
    // the "which pages get read" question needs.
    const params = new URLSearchParams({ p: pathname })
    if (document.referrer) params.set('r', document.referrer)

    const url = `/.netlify/functions/hit?${params.toString()}`
    // keepalive so the view still lands if the reader navigates away at once.
    fetch(url, { method: 'POST', keepalive: true }).catch(() => {})
  }, [pathname])

  return null
}
