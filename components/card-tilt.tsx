'use client'

import { type RefObject, useEffect } from 'react'

const MAX_TILT_DEG = 3

type CardTiltProps = {
  targetRef: RefObject<HTMLElement | null>
}

export default function CardTilt({ targetRef }: CardTiltProps) {
  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const widthMql = window.matchMedia('(min-width: 40rem)')

    let detach: (() => void) | null = null

    const handlePointerMove = (event: PointerEvent) => {
      const rect = target.getBoundingClientRect()
      const mx = (event.clientX - rect.left) / rect.width - 0.5
      const my = (event.clientY - rect.top) / rect.height - 0.5
      target.style.setProperty('--tilt-x', `${my * 2 * MAX_TILT_DEG}deg`)
      target.style.setProperty('--tilt-y', `${-mx * 2 * MAX_TILT_DEG}deg`)
    }

    const attach = () => {
      if (detach) return
      target.addEventListener('pointermove', handlePointerMove)
      detach = () => {
        target.removeEventListener('pointermove', handlePointerMove)
        target.style.removeProperty('--tilt-x')
        target.style.removeProperty('--tilt-y')
      }
    }

    const release = () => {
      detach?.()
      detach = null
    }

    const sync = () => {
      if (motionMql.matches || !widthMql.matches) release()
      else attach()
    }

    motionMql.addEventListener('change', sync)
    widthMql.addEventListener('change', sync)
    sync()

    return () => {
      motionMql.removeEventListener('change', sync)
      widthMql.removeEventListener('change', sync)
      release()
    }
  }, [targetRef])

  return null
}
