'use client'

import { useEffect, useRef } from 'react'

type Point = { x: number; y: number; t: number }

const TRAIL_LIFETIME_MS = 600
const TRAIL_LINE_WIDTH = 2

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const points: Point[] = []
    let raf = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      // Draw in CSS pixels.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      points.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        t: performance.now(),
      })
    }

    const tick = () => {
      const now = performance.now()
      while (points.length > 0) {
        const first = points[0]
        if (!first || now - first.t <= TRAIL_LIFETIME_MS) break
        points.shift()
      }

      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#0a0a0a'

      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]
        const b = points[i]
        if (!a || !b) continue
        const age = (now - b.t) / TRAIL_LIFETIME_MS
        ctx.globalAlpha = Math.max(0, 1 - age)
        ctx.lineWidth = TRAIL_LINE_WIDTH * (1 - age * 0.5)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(tick)
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) {
      canvas.addEventListener('pointermove', onPointerMove)
      raf = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointermove', onPointerMove)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6">
      <canvas
        ref={canvasRef}
        className="block aspect-[4/3] w-full touch-none rounded-xl bg-surface-2"
        aria-label="Interactive cursor trail canvas"
      />
      <p className="mt-4 text-center font-display text-foreground-muted text-xs uppercase">
        Move your cursor over the canvas
      </p>
    </div>
  )
}
