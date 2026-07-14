import { AnimatePresence, motion } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/cn'
import { useScribble } from '../use-scribble'

// animation tuning
const DRAW_SPEED = 600 // px/sec
const MIN_DRAW_SECONDS = 0.2 // floor, so short lines don't snap
const MAX_DRAW_SECONDS = 0.5 // ceiling, so long lines stay snappy
const LINE_STAGGER = 0.09 // gap between each wrapped line's stroke
const SPRING_BOUNCE = 0.15 // pathLength can't overshoot
const STROKE_WIDTH = 3.5 // marker thickness, px
const FADE_OUT_SECONDS = 0.16 // un-check: line blur-fades out this fast
const FADE_OUT_BLUR = 4 // blur added as it fades, px
const TEXT_GREY_SECONDS = 0.45 // grey-out on check
const TEXT_RESTORE_SECONDS = 0.15 // restore on un-check

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

type TodoItemProps = {
  text: string
  done: boolean
  onToggle: () => void
}

export function TodoItem({ text, done, onToggle }: TodoItemProps) {
  const boxRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const { scribble, box } = useScribble(boxRef, labelRef, done)

  return (
    <button
      type="button"
      onClick={onToggle}
      className="group flex w-full touch-manipulation items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-zinc-50 sm:gap-3.5 sm:px-4 sm:py-3.5"
    >
      <Checkbox done={done} />
      <span ref={boxRef} className="relative flex-1">
        <span
          ref={labelRef}
          className={cn(
            'text-base leading-6 transition-colors sm:text-lg sm:leading-7',
            done ? 'text-zinc-400' : 'text-zinc-800',
          )}
          // slow grey-out on check, quick restore on un-check
          style={{
            transitionDuration: `${(done ? TEXT_GREY_SECONDS : TEXT_RESTORE_SECONDS) * 1000}ms`,
          }}
        >
          {text}
        </span>
        <AnimatePresence>
          {done && box.width > 0 && (
            <motion.svg
              key="scribble"
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={box.width}
              height={box.height}
              viewBox={`0 0 ${box.width} ${box.height}`}
              style={{ mixBlendMode: 'multiply' }}
              exit={{ opacity: 0, filter: `blur(${FADE_OUT_BLUR}px)` }}
              transition={{ duration: FADE_OUT_SECONDS, ease: 'easeOut' }}
            >
              {scribble.map((line, li) => {
                // duration from width → steady marker velocity, clamped
                const visualDuration = clamp(
                  line.width / DRAW_SPEED,
                  MIN_DRAW_SECONDS,
                  MAX_DRAW_SECONDS,
                )
                const delay = li * LINE_STAGGER
                return (
                  <motion.path
                    key={line.d}
                    d={line.d}
                    fill="none"
                    stroke="var(--marker)"
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{
                      pathLength: {
                        type: 'spring',
                        visualDuration,
                        bounce: SPRING_BOUNCE,
                        delay,
                      },
                      // snap opacity on with the draw, else a pathLength:0 dot lingers
                      opacity: { duration: 0.001, delay },
                    }}
                  />
                )
              })}
            </motion.svg>
          )}
        </AnimatePresence>
      </span>
    </button>
  )
}

function Checkbox({ done }: { done: boolean }) {
  return (
    <span
      className={cn(
        'mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border transition-colors duration-200',
        done
          ? 'border-transparent bg-(--marker) text-white'
          : 'border-zinc-300 bg-white text-transparent group-hover:border-zinc-400',
      )}
    >
      <motion.svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-4.5"
        initial={false}
        animate={{ scale: done ? 1 : 0.6, opacity: done ? 1 : 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <path
          d="M20 6 9 17l-5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </span>
  )
}
