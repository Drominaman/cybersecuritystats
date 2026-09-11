// Benchmarks: one question, every source that answers it, a range and a median.
//
// The figures are reviewed by hand in the data site's admin and served from its
// public /api/benchmarks. This site otherwise runs on build-time snapshots, but
// a benchmark changes whenever a reviewer approves a figure, and a rebuild for
// that is the wrong tool: an hourly revalidate keeps the pages current without
// touching the snapshot pipeline.
export type ApprovedFigure = {
  value: number
  stat_title: string
  publisher: string | null
  report: string | null
  published_on: string | null
  link: string | null
}

export type Benchmark = {
  id: string
  question: string
  approved: ApprovedFigure[]
}

const SOURCE = 'https://cybersecuritystatistic.com/api/benchmarks'

export async function fetchBenchmarks(): Promise<Benchmark[]> {
  try {
    const res = await fetch(SOURCE, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = (await res.json()) as { questions?: Benchmark[] }
    return (data.questions ?? [])
      .filter((q) => q && q.id && q.question)
      .map((q) => ({ id: q.id, question: q.question, approved: (q.approved ?? []).filter((f) => Number.isFinite(f.value)) }))
  } catch {
    return []
  }
}

// Only benchmarks with something to show get a page. One source is a data
// point, not a benchmark.
export async function publishedBenchmarks(): Promise<Benchmark[]> {
  return (await fetchBenchmarks()).filter((b) => b.approved.length >= 2)
}

export function figureStats(figures: ApprovedFigure[]) {
  const vals = figures.map((f) => f.value).sort((a, b) => a - b)
  const n = vals.length
  const median = n === 0 ? 0 : n % 2 ? vals[(n - 1) / 2] : (vals[n / 2 - 1] + vals[n / 2]) / 2
  return {
    n,
    publishers: new Set(figures.map((f) => (f.publisher || '').trim()).filter(Boolean)).size,
    min: n ? vals[0] : 0,
    max: n ? vals[n - 1] : 0,
    median: Math.round(median * 10) / 10,
  }
}
