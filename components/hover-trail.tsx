'use client'

import { type RefObject, useEffect, useRef } from 'react'

const CELL_SIZE = 24
const TRAIL_DURATION = 800
const PEAK_ALPHA = 0.15

type HoverTrailProps = {
  targetRef: RefObject<HTMLElement | null>
}

export default function HoverTrail({ targetRef }: HoverTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const target = targetRef.current
    const canvas = canvasRef.current
    if (!target || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const widthMql = window.matchMedia('(min-width: 40rem)')

    let release: (() => void) | null = null

    const attach = () => {
      if (release) return

      const active = new Map<number, number>()
      let cssWidth = 0
      let cssHeight = 0
      let cellsX = 0
      let cellsY = 0
      let offsetX = 0
      let offsetY = 0
      let rafId: number | null = null

      const draw = () => {
        const now = performance.now()
        ctx.clearRect(0, 0, cssWidth, cssHeight)
        for (const [key, activatedAt] of active) {
          const t = (now - activatedAt) / TRAIL_DURATION
          if (t >= 1) {
            active.delete(key)
            continue
          }
          const x = (key % cellsX) * CELL_SIZE + offsetX
          const y = Math.floor(key / cellsX) * CELL_SIZE + offsetY
          ctx.fillStyle = `rgba(255, 255, 255, ${(1 - t) * PEAK_ALPHA})`
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
        }
        rafId = active.size > 0 ? requestAnimationFrame(draw) : null
      }

      const resize = () => {
        const rect = target.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1
        cssWidth = rect.width
        cssHeight = rect.height
        canvas.width = Math.round(cssWidth * dpr)
        canvas.height = Math.round(cssHeight * dpr)
        canvas.style.width = `${cssWidth}px`
        canvas.style.height = `${cssHeight}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        cellsX = Math.floor(cssWidth / CELL_SIZE) + 2
        cellsY = Math.floor(cssHeight / CELL_SIZE) + 2
        offsetX = (cssWidth - cellsX * CELL_SIZE) / 2
        offsetY = (cssHeight - cellsY * CELL_SIZE) / 2
        active.clear()
      }

      const handlePointerMove = (event: PointerEvent) => {
        const rect = target.getBoundingClientRect()
        const cx = Math.floor((event.clientX - rect.left - offsetX) / CELL_SIZE)
        const cy = Math.floor((event.clientY - rect.top - offsetY) / CELL_SIZE)
        if (cx < 0 || cy < 0 || cx >= cellsX || cy >= cellsY) return
        active.set(cy * cellsX + cx, performance.now())
        if (rafId === null) rafId = requestAnimationFrame(draw)
      }

      resize()
      const observer = new ResizeObserver(resize)
      observer.observe(target)
      target.addEventListener('pointermove', handlePointerMove)

      release = () => {
        observer.disconnect()
        target.removeEventListener('pointermove', handlePointerMove)
        if (rafId !== null) cancelAnimationFrame(rafId)
        ctx.clearRect(0, 0, cssWidth, cssHeight)
      }
    }

    const detach = () => {
      release?.()
      release = null
    }

    const sync = () => {
      if (motionMql.matches || !widthMql.matches) detach()
      else attach()
    }

    motionMql.addEventListener('change', sync)
    widthMql.addEventListener('change', sync)
    sync()

    return () => {
      motionMql.removeEventListener('change', sync)
      widthMql.removeEventListener('change', sync)
      detach()
    }
  }, [targetRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden sm:block"
    />
  )
}
