import { stdout } from 'node:process'

// A live spinner + per-item result log for the batch encode scripts. On a TTY
// it animates a single status line (count + in-flight names) while completed
// items scroll above it; in a pipe/CI it degrades to plain `[n/total]` lines
// with no escape codes, so logs stay clean.

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const SPIN_MS = 80
const isTTY = Boolean(stdout.isTTY)

const color = (code: number, s: string): string => (isTTY ? `\x1b[${code}m${s}\x1b[0m` : s)
const dim = (s: string) => color(2, s)
const green = (s: string) => color(32, s)
const red = (s: string) => color(31, s)

export type Progress = {
  start: (name: string) => void
  succeed: (name: string, detail?: string) => void
  fail: (name: string, detail?: string) => void
  stop: () => void
}

export function createProgress(total: number): Progress {
  const inFlight = new Set<string>()
  let completed = 0
  let frame = 0
  let timer: ReturnType<typeof setInterval> | null = null

  const spinnerLine = (): string => {
    const shown = [...inFlight].slice(0, 3).join(', ')
    const more = inFlight.size > 3 ? ` +${inFlight.size - 3}` : ''
    const active = shown ? ` ${dim('·')} ${shown}${more}` : ''
    return `${FRAMES[frame]} ${completed}/${total}${active}`
  }

  const redraw = () => {
    if (!isTTY) return
    frame = (frame + 1) % FRAMES.length
    stdout.write(`\r\x1b[K${spinnerLine()}`)
  }

  const scroll = (line: string) => {
    if (isTTY) stdout.write('\r\x1b[K')
    stdout.write(`${line}\n`)
    redraw()
  }

  if (isTTY) timer = setInterval(redraw, SPIN_MS)

  return {
    start(name) {
      inFlight.add(name)
    },
    succeed(name, detail) {
      inFlight.delete(name)
      completed++
      const tag = isTTY ? green('✓') : `[${completed}/${total}] ✓`
      scroll(`  ${tag} ${name}${detail ? `  ${dim(detail)}` : ''}`)
    },
    fail(name, detail) {
      inFlight.delete(name)
      completed++
      const tag = isTTY ? red('✗') : `[${completed}/${total}] ✗`
      scroll(`  ${tag} ${name}${detail ? `  ${red(detail)}` : ''}`)
    },
    stop() {
      if (timer) clearInterval(timer)
      if (isTTY) stdout.write('\r\x1b[K')
    },
  }
}
