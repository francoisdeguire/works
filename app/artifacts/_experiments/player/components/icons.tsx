import { cn } from '@/lib/cn'

// transport glyphs printed on the button faces; fill rides currentColor
type IconProps = { className?: string }

export function PlayIcon({ className }: IconProps) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: aria-hidden marks these as decorative; the button provides the label
    <svg viewBox="0 0 12 12" aria-hidden className={cn('size-5', className)}>
      <path d="M 3 2.5 L 10.25 6 L 3 9.5 Z" fill="currentColor" />
    </svg>
  )
}

export function FastForwardIcon({ className }: IconProps) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: aria-hidden marks these as decorative; the button provides the label
    <svg viewBox="0 0 12 12" aria-hidden className={cn('size-5', className)}>
      <path d="M1 2.5 5.75 6 1 9.5Z M6.25 2.5 11 6 6.25 9.5Z" fill="currentColor" />
    </svg>
  )
}

export function StopIcon({ className }: IconProps) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: aria-hidden marks these as decorative; the button provides the label
    <svg viewBox="0 0 12 12" aria-hidden className={cn('size-5', className)}>
      <rect x="2.25" y="2.25" width="7" height="7" fill="currentColor" />
    </svg>
  )
}
