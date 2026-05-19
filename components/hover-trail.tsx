'use client'

import { useEffect, useRef } from 'react'

const CELL_SIZE = 24
const TRAIL_DURATION = 800
const PEAK_ALPHA = 0.15

export default function HoverTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 40rem)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

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
      const rect = parent.getBoundingClientRect()
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
      const rect = parent.getBoundingClientRect()
      const cx = Math.floor((event.clientX - rect.left - offsetX) / CELL_SIZE)
      const cy = Math.floor((event.clientY - rect.top - offsetY) / CELL_SIZE)
      if (cx < 0 || cy < 0 || cx >= cellsX || cy >= cellsY) return
      active.set(cy * cellsX + cx, performance.now())
      if (rafId === null) rafId = requestAnimationFrame(draw)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(parent)
    parent.addEventListener('pointermove', handlePointerMove)

    return () => {
      observer.disconnect()
      parent.removeEventListener('pointermove', handlePointerMove)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden sm:block"
    />
  )
}
