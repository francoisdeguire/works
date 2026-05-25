'use client'

import { type MutableRefObject, type RefObject, useEffect, useRef, useState } from 'react'

const INERTIA_DECAY = 0.94
const INERTIA_STOP_THRESHOLD = 0.05
const MIN_INERTIA_VELOCITY = 0.3
const VELOCITY_SAMPLE_SIZE = 5

type PanRefs = {
  offsetRef: MutableRefObject<{ x: number; y: number }>
  isPanning: boolean
}

export function usePan(
  targetRef: RefObject<HTMLElement | null>,
  containerRef: RefObject<HTMLElement | null>,
  dirtyRef: MutableRefObject<boolean>,
): PanRefs {
  const offsetRef = useRef({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = motionMql.matches

    let panning = false
    let lastX = 0
    let lastY = 0
    let activePointerId: number | null = null
    const velocityBuffer: Array<{ dx: number; dy: number; t: number }> = []
    let inertiaRaf = 0

    const stopInertia = () => {
      if (inertiaRaf) {
        cancelAnimationFrame(inertiaRaf)
        inertiaRaf = 0
      }
    }

    const onMotionChange = () => {
      reducedMotion = motionMql.matches
      if (reducedMotion) stopInertia()
    }

    const onPointerDown = (e: PointerEvent) => {
      if (panning) return
      stopInertia()
      try {
        target.setPointerCapture(e.pointerId)
      } catch {
        // Element was removed mid-event; bail without setting panning state.
        return
      }
      panning = true
      activePointerId = e.pointerId
      lastX = e.clientX
      lastY = e.clientY
      velocityBuffer.length = 0
      setIsPanning(true)
      if (containerRef.current) {
        containerRef.current.style.willChange = 'transform'
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!panning || e.pointerId !== activePointerId) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      offsetRef.current = { x: offsetRef.current.x + dx, y: offsetRef.current.y + dy }
      dirtyRef.current = true
      velocityBuffer.push({ dx, dy, t: e.timeStamp })
      if (velocityBuffer.length > VELOCITY_SAMPLE_SIZE) velocityBuffer.shift()
    }

    const endPan = (e: PointerEvent) => {
      if (!panning || e.pointerId !== activePointerId) return
      panning = false
      activePointerId = null
      try {
        target.releasePointerCapture(e.pointerId)
      } catch {
        // Capture may already be released; nothing to do.
      }
      setIsPanning(false)

      const first = velocityBuffer[0]
      const last = velocityBuffer[velocityBuffer.length - 1]
      if (reducedMotion || !first || !last || first === last) {
        if (containerRef.current) containerRef.current.style.willChange = ''
        return
      }

      // Mean velocity over recent samples, normalized to px-per-frame (~16ms).
      const dt = last.t - first.t
      if (dt <= 0) {
        if (containerRef.current) containerRef.current.style.willChange = ''
        return
      }
      const totalDx = velocityBuffer.reduce((s, v, i) => (i === 0 ? 0 : s + v.dx), 0)
      const totalDy = velocityBuffer.reduce((s, v, i) => (i === 0 ? 0 : s + v.dy), 0)
      let vx = (totalDx / dt) * 16
      let vy = (totalDy / dt) * 16

      if (Math.hypot(vx, vy) < MIN_INERTIA_VELOCITY) {
        if (containerRef.current) containerRef.current.style.willChange = ''
        return
      }

      const step = () => {
        offsetRef.current = { x: offsetRef.current.x + vx, y: offsetRef.current.y + vy }
        dirtyRef.current = true
        vx *= INERTIA_DECAY
        vy *= INERTIA_DECAY
        if (Math.hypot(vx, vy) < INERTIA_STOP_THRESHOLD) {
          inertiaRaf = 0
          if (containerRef.current) containerRef.current.style.willChange = ''
          return
        }
        inertiaRaf = requestAnimationFrame(step)
      }
      inertiaRaf = requestAnimationFrame(step)
    }

    target.addEventListener('pointerdown', onPointerDown)
    target.addEventListener('pointermove', onPointerMove)
    target.addEventListener('pointerup', endPan)
    target.addEventListener('pointercancel', endPan)
    motionMql.addEventListener('change', onMotionChange)

    return () => {
      target.removeEventListener('pointerdown', onPointerDown)
      target.removeEventListener('pointermove', onPointerMove)
      target.removeEventListener('pointerup', endPan)
      target.removeEventListener('pointercancel', endPan)
      motionMql.removeEventListener('change', onMotionChange)
      stopInertia()
      if (containerRef.current) containerRef.current.style.willChange = ''
    }
  }, [targetRef, containerRef, dirtyRef])

  return { offsetRef, isPanning }
}
