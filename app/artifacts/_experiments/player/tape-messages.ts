// Message protocol shared with the AudioWorklet. The worklet is plain JS loaded
// outside the bundler, so it can't import this; it mirrors these shapes by hand.

// main thread to worklet
export type TapeInbound =
  | { type: 'load'; channels: Float32Array[] }
  | { type: 'seek'; position: number }

// worklet to main thread
export type TapeOutbound = { type: 'ended' } | { type: 'position'; seconds: number }
