import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const BUTTON_BASE =
  'group perspective-dramatic relative -my-0.25 flex flex-1 cursor-pointer justify-center overflow-clip p-6 text-zinc-800'
const BUTTON_POSITION = {
  first: '',
  middle: '',
  last: 'rounded-tr-sm',
} as const

const OVERLAY_BASE = 'absolute opacity-0 transition-opacity duration-150'
const OVERLAY_EFFECT = {
  press: 'player-shade inset-0 group-active:opacity-100 group-data-pressed:opacity-100',
  hover:
    'player-sheen -inset-0.5 group-hover:opacity-100 group-active:opacity-0 group-data-pressed:opacity-0',
  seamLeft:
    'player-seam-shade -top-full right-1/2 bottom-0 left-0 -translate-x-1/2 group-active:opacity-100 group-data-pressed:opacity-100',
  seamRight:
    'player-seam-light -top-full right-0 bottom-0 left-1/2 translate-x-1/2 group-active:opacity-100 group-data-pressed:opacity-100',
} as const

const DIVIDER_BASE = '-mt-0.25 w-0.75'
const DIVIDER_VARIANT = {
  gradient: 'player-bleed-y-2 bg-linear-to-b from-zinc-600 to-zinc-500',
  solid: 'player-bleed-y-4 bg-zinc-600',
} as const

type ButtonProps = {
  position?: keyof typeof BUTTON_POSITION
  label: string
  className?: string
  onClick?: () => void
  // momentary (held) behavior, e.g. fast-forward
  onPressStart?: () => void
  onPressEnd?: () => void
  // latched (mechanically locked down) state, e.g. play while playing
  pressed?: boolean
  // the key to the left/right is also down, so that seam is flush, no shadow
  leftPressed?: boolean
  rightPressed?: boolean
  children?: ReactNode
}

export function Button({
  position = 'middle',
  label,
  className,
  onClick,
  onPressStart,
  onPressEnd,
  pressed,
  leftPressed,
  rightPressed,
  children,
}: ButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      data-pressed={pressed || undefined}
      onClick={onClick}
      onPointerDown={onPressStart}
      onPointerUp={onPressEnd}
      onPointerLeave={onPressEnd}
      onPointerCancel={onPressEnd}
      className={cn(BUTTON_BASE, BUTTON_POSITION[position], className)}
    >
      {/* printed glyph rides the key face; the key hinges at its top edge, so
          pressing tips the glyph into the device */}
      <span className="pointer-events-none inline-flex origin-top transition-transform duration-150 group-active:translate-y-px group-active:-rotate-x-30 group-data-pressed:translate-y-px group-data-pressed:-rotate-x-30">
        {children}
      </span>
      <div className={cn(OVERLAY_BASE, OVERLAY_EFFECT.press)} />
      <div className={cn(OVERLAY_BASE, OVERLAY_EFFECT.hover)} />
      {position !== 'first' && !leftPressed && (
        <div className={cn(OVERLAY_BASE, OVERLAY_EFFECT.seamLeft)} />
      )}
      {!rightPressed && <div className={cn(OVERLAY_BASE, OVERLAY_EFFECT.seamRight)} />}
      <div className="player-edge-highlight absolute inset-x-0 top-0 h-2" />
    </button>
  )
}

export function Divider({ variant }: { variant: keyof typeof DIVIDER_VARIANT }) {
  return <div className={cn(DIVIDER_BASE, DIVIDER_VARIANT[variant])} />
}
