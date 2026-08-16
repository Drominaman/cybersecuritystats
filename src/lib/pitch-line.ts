import type { Pitch } from '@/lib/popup-pitch'

/**
 * The sentence the signup form leads with.
 *
 * Lives apart from popup-pitch because that module imports the statistics
 * snapshot. A client component may take the shape of a Pitch as a type, which
 * is erased at compile time, but importing a function from there would pull
 * several megabytes of JSON into the browser bundle.
 */
export function pitchLine(p: Pitch, isTotal: boolean): string {
  const subject = isTotal ? 'cybersecurity statistics' : `${p.label.toLowerCase()} statistics`
  const unit = isTotal ? 'reports' : 'sources'
  return (
    `${p.stats.toLocaleString()} ${subject} from ${p.sources.toLocaleString()} ${unit}, ` +
    'each linked to the report it came from. New figures every week.'
  )
}
