import type { ApprovedFigure } from '@/lib/benchmarks'

// Scatter of figure against report date: the two dimensions the data actually
// has. With a handful of sources each dot is labelled directly, so there is no
// legend and no lookup. Server-rendered SVG, monochrome, no script.
const W = 760
const H = 300
const L = 46
const R = 18
const T = 18
const B = 42

function fmtMonth(ms: number): string {
  return new Date(ms).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

export default function SourceScatter({
  figures,
  median,
}: {
  figures: ApprovedFigure[]
  median: number
}) {
  const dated = figures
    .filter(f => f.published_on && isFinite(new Date(f.published_on).getTime()))
    .map(f => ({ ...f, t: new Date(f.published_on as string).getTime() }))
  const undatedCount = figures.length - dated.length
  if (dated.length < 2) return null

  const pw = W - L - R
  const ph = H - T - B

  // Bands: the full range of figures, and the middle half where they bunch.
  const sorted = dated.map(d => d.value).sort((a, b) => a - b)
  const quant = (p: number) => {
    const i = (sorted.length - 1) * p
    const lo = Math.floor(i), hi = Math.ceil(i)
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo)
  }
  const vMin = sorted[0]
  const vMax = sorted[sorted.length - 1]
  const q1 = quant(0.25)
  const q3 = quant(0.75)
  const showMidBand = dated.length >= 4
  const t0 = Math.min(...dated.map(d => d.t))
  const t1 = Math.max(...dated.map(d => d.t))
  const spread = t1 - t0
  const PAD = 26
  const X = (t: number) => (spread === 0 ? L + pw / 2 : L + PAD + ((t - t0) / spread) * (pw - PAD * 2))
  const Y = (v: number) => T + (1 - v / 100) * ph

  // Least-squares trend, only when there is enough to fit honestly: four or
  // more points across at least five months.
  const MONTHS_5 = 150 * 24 * 3600 * 1000
  let trend: { y0: number; y1: number } | null = null
  if (dated.length >= 4 && spread >= MONTHS_5) {
    let sx = 0, sy = 0, sxx = 0, sxy = 0
    dated.forEach(d => {
      const nx = (d.t - t0) / spread
      sx += nx; sy += d.value; sxx += nx * nx; sxy += nx * d.value
    })
    const n = dated.length
    const denom = n * sxx - sx * sx
    if (denom !== 0) {
      const slope = (n * sxy - sx * sy) / denom
      const inter = (sy - slope * sx) / n
      const clamp = (v: number) => Math.max(0, Math.min(100, v))
      trend = { y0: clamp(inter), y1: clamp(slope + inter) }
    }
  }

  // Direct labels. Long publisher names are truncated (the table below carries
  // the full name), and collisions are detected on the label's actual extent:
  // two sources with the same value can sit far apart in date yet still touch,
  // because a label reaches across the plot.
  const CHAR_W = 6.3
  const shortName = (s: string) => (s.length > 24 ? s.slice(0, 23) + '\u2026' : s)
  const pts = dated
    .map(d => {
      const x = X(d.t)
      const rightSide = x < L + pw * 0.72
      const label = `${shortName(d.publisher || 'Unknown')} ${d.value}%`
      const w = label.length * CHAR_W
      const x0 = rightSide ? x + 10 : x - 10 - w
      return { d, x, y: Y(d.value), rightSide, labelY: Y(d.value), label, x0, x1: x0 + w }
    })
    .sort((a, b) => a.y - b.y)
  for (let i = 1; i < pts.length; i++) {
    for (let j = 0; j < i; j++) {
      const prev = pts[j]
      const cur = pts[i]
      const horizontal = cur.x0 < prev.x1 && prev.x0 < cur.x1
      if (horizontal && Math.abs(cur.labelY - prev.labelY) < 13) {
        cur.labelY = prev.labelY + 13
      }
    }
  }

  const monthsSpan = Math.max(1, Math.round(spread / 2629800000))
  const xTicks =
    spread === 0
      ? [[L + pw / 2, fmtMonth(t0), 'middle'] as const]
      : ([
          [X(t0), fmtMonth(t0), 'start'],
          [X((t0 + t1) / 2), fmtMonth((t0 + t1) / 2), 'middle'],
          [X(t1), fmtMonth(t1), 'end'],
        ] as const)

  return (
    <figure style={{ margin: '20px 0 30px' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label="Each source's figure plotted against the date its report was published"
      >
        <style>{`.bm-dot { transition: stroke-width .1s; } .bm-dot:hover { stroke-width: 5px; } a:focus .bm-dot { stroke-width: 5px; }`}</style>
        <rect x={L} y={Y(vMax)} width={pw} height={Y(vMin) - Y(vMax)} fill="#f7f7f7" />
        {showMidBand && (
          <rect x={L} y={Y(q3)} width={pw} height={Y(q1) - Y(q3)} fill="#eaeaea" />
        )}

        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={L} y1={Y(v)} x2={W - R} y2={Y(v)} stroke="#ededed" strokeWidth={1} />
            <text x={L - 8} y={Y(v) + 4} fontSize={11} fill="#6b7280" textAnchor="end">
              {v}%
            </text>
          </g>
        ))}

        <line x1={L} y1={Y(median)} x2={W - R} y2={Y(median)} stroke="#6b7280" strokeWidth={1.5} strokeDasharray="2 3" />
        <text x={W - R - 4} y={Y(median) - 6} fontSize={10.5} fontWeight={700} fill="#6b7280" textAnchor="end"
          paintOrder="stroke" stroke="#fff" strokeWidth={3}>
          Median {median}%
        </text>

        {trend && (
          <line x1={L + PAD} y1={Y(trend.y0)} x2={L + pw - PAD} y2={Y(trend.y1)} stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="6 4" />
        )}

        <line x1={L} y1={T} x2={L} y2={H - B} stroke="#000" strokeWidth={1} />
        <line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke="#000" strokeWidth={1} />
        {xTicks.map(([x, label, anchor], i) => (
          <text key={i} x={x} y={H - B + 18} fontSize={11} fill="#6b7280" textAnchor={anchor}>
            {label}
          </text>
        ))}

        {pts.map((p, i) => {
          const mark = (
            <g>
              <circle className="bm-dot" cx={p.x} cy={p.y} r={5.5} fill="#000" stroke="#fff" strokeWidth={2}>
                <title>{`${p.d.value}% ${p.d.stat_title}${p.d.publisher ? ` (${p.d.publisher})` : ''}`}</title>
              </circle>
              <text
                x={p.rightSide ? p.x + 10 : p.x - 10}
                y={p.labelY + 4}
                fontSize={11}
                fontWeight={700}
                fill="#000"
                textAnchor={p.rightSide ? 'start' : 'end'}
                paintOrder="stroke"
                stroke="#fff"
                strokeWidth={3}
              >
                {p.label}
              </text>
            </g>
          )
          return p.d.link ? (
            <a key={i} href={p.d.link} target="_blank" rel="noopener noreferrer" aria-label={`${p.d.publisher}: open the report`}>
              {mark}
            </a>
          ) : (
            <g key={i}>{mark}</g>
          )
        })}
      </svg>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginTop: '10px', fontSize: '11.5px', color: '#374151' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#000', display: 'inline-block' }} />
          One source
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '16px', height: '11px', background: '#f7f7f7', border: '1px solid #e0e0e0', display: 'inline-block' }} />
          Full range {vMin}%–{vMax}%
        </span>
        {showMidBand && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '16px', height: '11px', background: '#eaeaea', display: 'inline-block' }} />
            Middle half
          </span>
        )}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '18px', borderTop: '2px dotted #6b7280', display: 'inline-block' }} />
          Median {median}%
        </span>
        {trend && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '18px', borderTop: '2px dashed #9ca3af', display: 'inline-block' }} />
            Trend, indicative
          </span>
        )}
      </div>

      <figcaption style={{ fontSize: '12px', color: '#6b7280', marginTop: '10px', maxWidth: '70ch' }}>
        Dots are placed by figure and report date. Hover one for the full statistic; click it to open the report.
        {trend
          ? ` The trend line is fitted across ${dated.length} reports over about ${monthsSpan} months, too short a window to be more than indicative.`
          : ''}
        {undatedCount > 0 ? ` ${undatedCount} undated source${undatedCount === 1 ? ' is' : 's are'} listed in the table but not plotted.` : ''}
      </figcaption>
    </figure>
  )
}
