const SHORT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  timeZone: 'UTC',
})

const LONG = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatShortDate(iso: string): string {
  return SHORT.format(new Date(iso)).toUpperCase()
}

export function formatLongDate(iso: string): string {
  return LONG.format(new Date(iso)).toUpperCase()
}
