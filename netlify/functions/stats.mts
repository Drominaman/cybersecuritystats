import { getStore } from '@netlify/blobs'

/**
 * Reads back what hit.mts recorded, as a plain page.
 *
 * Aggregate counts for a public website are not sensitive, so this is not
 * behind a password, but it carries noindex so it never turns up in search.
 * Bots are counted separately rather than dropped: knowing how much of the
 * traffic is crawlers is part of the answer.
 */

const DAYS = 30

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))
}

export default async (req: Request) => {
  const store = getStore('pageviews')

  const days: string[] = []
  const today = new Date()
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(today.getTime() - i * 86400000)
    days.push(d.toISOString().slice(0, 10))
  }

  const byDay = new Map<string, { human: number; bot: number }>()
  const byPath = new Map<string, number>()
  const byRef = new Map<string, number>()
  let human = 0
  let bot = 0

  for (const day of days) {
    const { blobs } = await store.list({ prefix: `${day}/` })
    const counts = { human: 0, bot: 0 }
    for (const b of blobs) {
      const v = (await store.get(b.key, { type: 'json' })) as
        | { p?: string; r?: string; b?: boolean }
        | null
      if (!v) continue
      if (v.b) {
        counts.bot++
        bot++
        continue
      }
      counts.human++
      human++
      byPath.set(v.p || '/', (byPath.get(v.p || '/') ?? 0) + 1)
      if (v.r) byRef.set(v.r, (byRef.get(v.r) ?? 0) + 1)
    }
    byDay.set(day, counts)
  }

  const top = (m: Map<string, number>, n: number) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n)

  const url = new URL(req.url)
  if (url.searchParams.get('format') === 'json') {
    return new Response(
      JSON.stringify(
        { days: Object.fromEntries(byDay), paths: Object.fromEntries(byPath), referrers: Object.fromEntries(byRef), human, bot },
        null,
        2,
      ),
      { headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } },
    )
  }

  const rows = (pairs: [string, number][]) =>
    pairs.length
      ? pairs.map(([k, v]) => `<tr><td>${esc(k)}</td><td class="n">${v}</td></tr>`).join('')
      : '<tr><td colspan="2">Nothing recorded yet.</td></tr>'

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Traffic</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;color:#000;background:#fff;max-width:820px;margin:0 auto;padding:24px}
h1{font-size:28px;letter-spacing:-0.02em;margin:0 0 4px}
h2{font-size:15px;margin:32px 0 8px}
p.sub{color:#555;font-size:13px;margin:0 0 24px}
table{border-collapse:collapse;width:100%;font-size:13px}
th,td{border:1px solid #000;padding:6px 8px;text-align:left}
td.n,th.n{text-align:right;width:90px}
.big{font-size:34px;font-weight:900}
.k{color:#555;font-size:12px}
</style></head><body>
<h1>Traffic</h1>
<p class="sub">cybersecuritystats.com, last ${DAYS} days. Counted first-party, no cookies.</p>
<p><span class="big">${human}</span> <span class="k">page views by people</span> &nbsp; <span class="big">${bot}</span> <span class="k">by bots</span></p>
<h2>By day</h2>
<table><tr><th>Day</th><th class="n">People</th><th class="n">Bots</th></tr>
${[...byDay.entries()].map(([d, c]) => `<tr><td>${d}</td><td class="n">${c.human}</td><td class="n">${c.bot}</td></tr>`).join('')}
</table>
<h2>Top pages</h2>
<table><tr><th>Path</th><th class="n">Views</th></tr>${rows(top(byPath, 25))}</table>
<h2>Referrers</h2>
<table><tr><th>Source</th><th class="n">Views</th></tr>${rows(top(byRef, 25))}</table>
</body></html>`

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  })
}
