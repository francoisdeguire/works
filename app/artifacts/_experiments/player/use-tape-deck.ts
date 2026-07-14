import { type MotionValue, useAnimationFrame, useMotionValue } from 'motion/react'
import { useEffect, useRef } from 'react'
import type { TapeInbound, TapeOutbound } from './tape-messages'

const ATTACK = 12 // per-second approach rate while the level rises
const RELEASE = 6 // per-second approach rate while it falls
// meters read in dB, like real VU; a linear RMS scale pins at the drop
const METER_FLOOR_DB = -20 // bottom LED threshold
const METER_CEIL_DB = -8 // RMS that pins the meter (mastered drops near -9 dB)
const FFT_SIZE = 1024

export type MeterLevels = readonly [MotionValue<number>, MotionValue<number>]

// VU ballistics: fast attack, slow release
const settle = (mv: MotionValue<number>, target: number, delta: number) => {
  const k = target > mv.get() ? ATTACK : RELEASE
  mv.set(mv.get() + (target - mv.get()) * Math.min(1, (k * delta) / 1000))
}

const rms = (analyser: AnalyserNode, buf: Float32Array<ArrayBuffer>) => {
  analyser.getFloatTimeDomainData(buf)
  // AC-coupled like a real meter: a frozen tape holds its last sample (pure
  // DC), which must read as silence, so measure around the mean
  let mean = 0
  for (let i = 0; i < buf.length; i++) mean += buf[i] ?? 0
  mean /= buf.length
  let sum = 0
  for (let i = 0; i < buf.length; i++) {
    const v = (buf[i] ?? 0) - mean
    sum += v * v
  }
  return Math.sqrt(sum / buf.length)
}

// map RMS onto the meter's dB window
const toLevel = (value: number) => {
  if (value <= 0) return 0
  const db = 20 * Math.log10(value)
  return Math.min(1, Math.max(0, (db - METER_FLOOR_DB) / (METER_CEIL_DB - METER_FLOOR_DB)))
}

type Deck = {
  ctx: AudioContext
  node: AudioWorkletNode
  rate: AudioParam
  analysers: [AnalyserNode, AnalyserNode]
  scratch: Float32Array<ArrayBuffer>
}

export type TapeDeck = {
  // create/resume the audio graph; must be called from a user gesture
  start: () => Promise<void>
  // signed tape speed: 1 = normal, 0 = frozen, negative = reverse
  setRate: (rate: number) => void
  seekToStart: () => void
  // stereo levels following the actual output signal
  levels: MeterLevels
  // playhead in seconds, reported by the worklet ~10×/s
  position: MotionValue<number>
  // track length in seconds, known once the buffer decodes
  duration: MotionValue<number>
}

export function useTapeDeck(
  trackUrl: string,
  { onEnded }: { onEnded?: () => void } = {},
): TapeDeck {
  const levelL = useMotionValue(0)
  const levelR = useMotionValue(0)
  const position = useMotionValue(0)
  const duration = useMotionValue(0)
  const deck = useRef<Deck | null>(null)
  const loading = useRef<Promise<void> | null>(null)

  const onEndedRef = useRef(onEnded)
  useEffect(() => {
    onEndedRef.current = onEnded
  })

  // tear the graph down on unmount, or the AudioContext stays open and the
  // worklet keeps producing sound after the user navigates away
  useEffect(() => {
    return () => {
      void deck.current?.ctx.close()
      deck.current = null
      loading.current = null
    }
  }, [])

  const init = async () => {
    const ctx = new AudioContext()
    await ctx.audioWorklet.addModule('/artifacts/player/tape-processor.js')
    const res = await fetch(trackUrl)
    const buffer = await ctx.decodeAudioData(await res.arrayBuffer())
    duration.set(buffer.duration)

    const node = new AudioWorkletNode(ctx, 'tape-processor', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    })
    const left = buffer.getChannelData(0)
    const right = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : left
    node.port.postMessage({ type: 'load', channels: [left, right] } satisfies TapeInbound)
    node.port.onmessage = ({ data }: MessageEvent<TapeOutbound>) => {
      if (data.type === 'ended') onEndedRef.current?.()
      else if (data.type === 'position') position.set(data.seconds)
    }

    // sound out, plus per-channel analysers for the VU meters
    const splitter = ctx.createChannelSplitter(2)
    const analyserL = ctx.createAnalyser()
    const analyserR = ctx.createAnalyser()
    analyserL.fftSize = FFT_SIZE
    analyserR.fftSize = FFT_SIZE
    node.connect(ctx.destination)
    node.connect(splitter)
    splitter.connect(analyserL, 0)
    splitter.connect(analyserR, 1)

    const rateParam = (node.parameters as ReadonlyMap<string, AudioParam>).get('rate')
    if (!rateParam) throw new Error('tape-processor "rate" param missing')

    deck.current = {
      ctx,
      node,
      rate: rateParam,
      analysers: [analyserL, analyserR],
      scratch: new Float32Array(FFT_SIZE),
    }
  }

  const start = async () => {
    // a failed init must not poison the lazy guard; clear it so a later gesture retries
    loading.current ??= init().catch((error) => {
      loading.current = null
      throw error
    })
    await loading.current
    await deck.current?.ctx.resume()
  }

  const setRate = (rate: number) => {
    if (deck.current) deck.current.rate.value = rate
  }

  const seekToStart = () => {
    deck.current?.node.port.postMessage({ type: 'seek', position: 0 } satisfies TapeInbound)
    position.set(0) // don't wait for the next worklet report
  }

  useAnimationFrame((_, delta) => {
    const d = deck.current
    if (!d) return
    settle(levelL, toLevel(rms(d.analysers[0], d.scratch)), delta)
    settle(levelR, toLevel(rms(d.analysers[1], d.scratch)), delta)
  })

  return {
    start,
    setRate,
    seekToStart,
    levels: [levelL, levelR] as const,
    position,
    duration,
  }
}
