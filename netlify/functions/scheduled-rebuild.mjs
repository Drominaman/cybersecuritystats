/**
 * Weekly rebuild.
 *
 * The site is fully static: every page is baked from the snapshot that
 * `prebuild` pulls out of Supabase, so the stats only move when a build runs.
 * Without this the content silently ages — it had drifted three months behind
 * the database before the last refresh.
 *
 * Triggering the build hook redeploys the site, which re-runs the fetch.
 */
export default async () => {
  const hook = process.env.BUILD_HOOK_URL

  if (!hook) {
    console.error('BUILD_HOOK_URL is not set — skipping scheduled rebuild')
    return new Response('missing BUILD_HOOK_URL', { status: 500 })
  }

  const response = await fetch(hook, { method: 'POST' })

  if (!response.ok) {
    console.error(`Build hook returned ${response.status}`)
    return new Response(`build hook failed: ${response.status}`, { status: 502 })
  }

  console.log('Triggered weekly rebuild')
  return new Response('rebuild triggered')
}

// Mondays at 04:00 UTC, before the working week.
export const config = {
  schedule: '0 4 * * 1',
}
