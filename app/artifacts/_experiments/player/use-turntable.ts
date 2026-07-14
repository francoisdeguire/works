import { useAnimationFrame, useMotionValue, useSpring } from 'motion/react'
import { type PointerEvent, useRef, useState } from 'react'
import { useTapeDeck } from './use-tape-deck'

const REEL_SPEED = 144 // deg/s while playing
const FF_MULTIPLIER = 2 // reel speed while fast-forward is held
const REST_ANGLE = -45 // platter graphics are axis-aligned; the rest pose supplies the diagonal

export type ScrubHandlers = {
  onPointerDown: (e: PointerEvent<HTMLDivElement>) => void
  onPointerMove: (e: PointerEvent<HTMLDivElement>) => void
  onPointerUp: () => void
  onPointerCancel: () => void
  onPointerLeave: () => void
}

// Transport and scratch physics. Owns the velocity spring, the reel angle, and
// the rAF loop tying them to playback, so the device component just renders.
export function useTurntable(trackUrl: string) {
  // UI source of truth for the transport; velocity carries the motion
  const [playing, setPlaying] = useState(false)
  const [ffHeld, setFfHeld] = useState(false)
  // reel velocity springs between 0 and REEL_SPEED for spin-up/down inertia
  const velocity = useSpring(0, { stiffness: 90, damping: 20 })
  const rotation = useMotionValue(REST_ANGLE)

  // rewind is deferred until the reel settles: seeking while it still coasts
  // would play the top of the track through the spool-down
  const pendingSeek = useRef(false)
  const scrubbing = useRef(false)
  const prevPointerAngle = useRef(0)
  const prevRotation = useRef(REST_ANGLE)
  const dragVelocity = useRef(0) // deg/s, smoothed while scrubbing

  // stop the motor and rewind to 0 once the reel has coasted to rest
  const stopAndRewind = () => {
    setPlaying(false)
    velocity.set(0)
    pendingSeek.current = true
  }

  const tape = useTapeDeck(trackUrl, {
    // track ran out: same as hitting restart. the tape holds silent at its end
    // while the reel coasts down, then rewinds
    onEnded: stopAndRewind,
  })

  useAnimationFrame((_, delta) => {
    // motor: integrate rotation from velocity unless a finger holds the reel
    if (!scrubbing.current) {
      const v = velocity.get()
      if (Math.abs(v) > 0.01) rotation.set(rotation.get() + (v * delta) / 1000)
    }
    // the reel IS the transport: tape speed follows the reel's measured angular
    // velocity, so motor spooling and scratching share one path
    const r = rotation.get()
    if (delta > 0) {
      const degPerSec = ((r - prevRotation.current) / delta) * 1000
      tape.setRate(degPerSec / REEL_SPEED)
      // reel has coasted to rest after the track ran out: auto-rewind
      if (pendingSeek.current && !scrubbing.current && Math.abs(degPerSec) < 1) {
        pendingSeek.current = false
        tape.seekToStart()
      }
      if (scrubbing.current) {
        // smooth over ~80ms so release hands off the flick, not one noisy frame
        dragVelocity.current += (degPerSec - dragVelocity.current) * Math.min(1, delta / 80)
      }
    }
    prevRotation.current = r
  })

  const setTransport = async (next: boolean) => {
    setPlaying(next)
    if (next) {
      // play beat the coast-down to the rewind: start from the top now
      if (pendingSeek.current) {
        pendingSeek.current = false
        tape.seekToStart()
      }
      try {
        await tape.start()
      } catch {
        // audio failed to start (decode/worklet/network): revert so the UI matches
        setPlaying(false)
        velocity.set(0)
        return
      }
    }
    velocity.set(next ? REEL_SPEED : 0)
  }

  // momentary fast-forward: 2× while held, winds even when stopped
  const startFastForward = async () => {
    setFfHeld(true)
    try {
      await tape.start()
    } catch {
      setFfHeld(false)
      return
    }
    velocity.set(REEL_SPEED * FF_MULTIPLIER)
  }

  const stopFastForward = () => {
    setFfHeld(false)
    velocity.set(playing ? REEL_SPEED : 0)
  }

  const pointerAngle = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    return (Math.atan2(y, x) * 180) / Math.PI
  }

  const onScrubStart = (e: PointerEvent<HTMLDivElement>) => {
    // no pointer capture: the grab should end as soon as the pointer leaves
    scrubbing.current = true
    pendingSeek.current = false // grabbing the reel takes over the playhead
    velocity.jump(0) // grabbing the reel stops the motor dead, no spring
    dragVelocity.current = 0
    prevPointerAngle.current = pointerAngle(e)
  }

  const onScrubMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!scrubbing.current) return
    const angle = pointerAngle(e)
    let delta = angle - prevPointerAngle.current
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    prevPointerAngle.current = angle
    rotation.set(rotation.get() + delta)
  }

  const onScrubEnd = () => {
    if (!scrubbing.current) return
    scrubbing.current = false
    // hand off the flick: the spring continues from the released velocity toward
    // the motor target (or coasts to rest if stopped)
    velocity.jump(dragVelocity.current)
    velocity.set(playing ? REEL_SPEED : 0)
    dragVelocity.current = 0
  }

  const scrub: ScrubHandlers = {
    onPointerDown: onScrubStart,
    onPointerMove: onScrubMove,
    onPointerUp: onScrubEnd,
    onPointerCancel: onScrubEnd,
    onPointerLeave: onScrubEnd,
  }

  // transport handlers return void: the async work catches its own failures, so
  // the JSX call sites never float an unhandled promise
  const transport = {
    play: () => void setTransport(true),
    stop: () => void setTransport(false),
    restart: stopAndRewind,
    startFastForward: () => void startFastForward(),
    stopFastForward,
  }

  return {
    playing,
    ffHeld,
    rotation,
    levels: tape.levels,
    position: tape.position,
    duration: tape.duration,
    scrub,
    transport,
  }
}
