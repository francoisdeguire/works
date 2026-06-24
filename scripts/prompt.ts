import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'

// Minimal stdin prompter shared by the encode scripts. Interactive only on a
// TTY: in a non-interactive context (CI, a pipe) callers fall back to flags
// rather than block forever on a question nothing can answer.
export const isInteractive = Boolean(stdin.isTTY)

export type Prompter = {
  ask: (question: string, fallback?: string) => Promise<string>
  close: () => void
}

export function createPrompter(): Prompter {
  const rl = createInterface({ input: stdin, output: stdout })
  return {
    async ask(question, fallback) {
      const suffix = fallback ? ` [${fallback}]` : ''
      const answer = (await rl.question(`${question}${suffix}: `)).trim()
      return answer || fallback || ''
    },
    close() {
      rl.close()
    },
  }
}
