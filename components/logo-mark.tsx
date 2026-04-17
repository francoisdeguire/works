type LogoMarkProps = {
  size?: number
}

export default function LogoMark({ size = 20 }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="currentColor" aria-hidden="true">
      <rect x="8" y="0" width="4" height="4" />
      <rect x="4" y="4" width="4" height="4" />
      <rect x="12" y="4" width="4" height="4" />
      <rect x="0" y="8" width="4" height="4" />
      <rect x="16" y="8" width="4" height="4" />
      <rect x="4" y="12" width="4" height="4" />
      <rect x="12" y="12" width="4" height="4" />
      <rect x="8" y="16" width="4" height="4" />
    </svg>
  )
}
