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
      let last: { cx: number; cy: number } | null = null

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
        const dpr = window.devicePixelRatio || 1
        cssWidth = target.clientWidth
        cssHeight = target.clientHeight
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
        last = null
      }

      const activate = (cx: number, cy: number, at: number) => {
        if (cx < 0 || cy < 0 || cx >= cellsX || cy >= cellsY) return
        active.set(cy * cellsX + cx, at)
      }

      const activateLine = (x0: number, y0: number, x1: number, y1: number, at: number) => {
        const dx = Math.abs(x1 - x0)
        const dy = -Math.abs(y1 - y0)
        const sx = x0 < x1 ? 1 : -1
        const sy = y0 < y1 ? 1 : -1
        let err = dx + dy
        let x = x0
        let y = y0
        for (;;) {
          activate(x, y, at)
          if (x === x1 && y === y1) return
          const e2 = 2 * err
          if (e2 >= dy) {
            err += dy
            x += sx
          }
          if (e2 <= dx) {
            err += dx
            y += sy
          }
        }
      }

      const handlePointerMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect()
        const at = performance.now()
        const coalesced = event.getCoalescedEvents?.() ?? []

        for (const sample of coalesced.length > 0 ? coalesced : [event]) {
          const cx = Math.floor((sample.clientX - rect.left - offsetX) / CELL_SIZE)
          const cy = Math.floor((sample.clientY - rect.top - offsetY) / CELL_SIZE)
          if (last) activateLine(last.cx, last.cy, cx, cy, at)
          else activate(cx, cy, at)
          last = { cx, cy }
        }

        if (rafId === null) rafId = requestAnimationFrame(draw)
      }

      /* Without this, re-entering elsewhere draws a line from the stale cell. */
      const handlePointerLeave = () => {
        last = null
      }

      resize()
      const observer = new ResizeObserver(resize)
      observer.observe(target)
      target.addEventListener('pointermove', handlePointerMove)
      target.addEventListener('pointerleave', handlePointerLeave)

      release = () => {
        observer.disconnect()
        target.removeEventListener('pointermove', handlePointerMove)
        target.removeEventListener('pointerleave', handlePointerLeave)
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
