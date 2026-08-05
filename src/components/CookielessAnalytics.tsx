import Script from 'next/script'

/**
 * Cookieless analytics, run in parallel with Microsoft Clarity to give us a
 * traffic baseline that does not depend on consent.
 *
 * Clarity is session-recording: it stores identifiers on the device, so once a
 * consent banner goes in, Clarity only ever sees the visitors who accept. That
 * makes it useless for answering "did traffic actually change?". These beacons
 * set no cookies and read nothing from the device, so they see 100% of
 * visitors before, during and after any consent work.
 *
 * Renders nothing until a token is configured, so this is safe to merge and
 * deploy before the analytics accounts exist.
 */
export default function CookielessAnalytics() {
  const cfToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  if (!cfToken && !plausibleDomain) return null

  return (
    <>
      {cfToken ? (
        <Script
          id="cf-analytics"
          strategy="afterInteractive"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: cfToken })}
        />
      ) : null}
      {plausibleDomain ? (
        <Script
          id="plausible-analytics"
          strategy="afterInteractive"
          src="https://plausible.io/js/script.js"
          data-domain={plausibleDomain}
        />
      ) : null}
    </>
  )
}
