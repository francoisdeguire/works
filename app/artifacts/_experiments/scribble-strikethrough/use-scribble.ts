import { type RefObject, useLayoutEffect, useRef, useState } from 'react'
import { buildScribble, type Line, type ScribbleLine } from './scribble'

// tuning
const BASELINE = 0.62 // 0–1 down the text line the stroke rides (0.5 = center)

type Box = { width: number; height: number }

// Measures the label's wrapped lines and builds a stroke for each.
export function useScribble(
  boxRef: RefObject<HTMLElement | null>,
  labelRef: RefObject<HTMLElement | null>,
  done: boolean,
) {
  const [scribble, setScribble] = useState<ScribbleLine[]>([])
  const [box, setBox] = useState<Box>({ width: 0, height: 0 })
  // ref, not state: stable across resizes
  const seedRef = useRef(0)

  useLayoutEffect(() => {
    if (!done) return
    const boxEl = boxRef.current
    const labelEl = labelRef.current
    if (!boxEl || !labelEl) return

    // new seed for this completion, so re-checking looks different
    seedRef.current = (Math.random() * 2 ** 31) | 0

    const measure = () => {
      const origin = boxEl.getBoundingClientRect()
      const range = document.createRange()
      range.selectNodeContents(labelEl)
      const rects = Array.from(range.getClientRects()).filter((r) => r.width > 1)
      const lines: Line[] = rects.map((r) => ({
        x0: r.left - origin.left,
        x1: r.right - origin.left,
        // sit just below center, like a strike-through
        y: r.top - origin.top + r.height * BASELINE,
      }))
      setBox({ width: origin.width, height: origin.height })
      setScribble(buildScribble(lines, seedRef.current))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(boxEl)
    return () => ro.disconnect()
  }, [done, boxRef, labelRef])

  return { scribble, box }
}
