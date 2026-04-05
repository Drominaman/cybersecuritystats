export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

/** Fix ALL CAPS or all lowercase publisher names to title case */
export function titleCase(text: string): string {
  // If it's an acronym (3 chars or less, all caps), keep it
  if (text.length <= 4 && text === text.toUpperCase()) return text
  // If mixed case already, leave it alone
  if (text !== text.toUpperCase() && text !== text.toLowerCase()) return text
  // Convert ALL CAPS to title case
  return text
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
