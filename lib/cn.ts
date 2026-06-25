type ClassDict = Record<string, unknown>
type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassDict
  | ClassValue[]
  // Base UI types `className` as `string | ((state) => string)`. cn has no component state to
  // resolve the callback with, so it accepts and skips it — same effective no-op as clsx.
  | ((...args: never[]) => unknown)

export function cn(...args: ClassValue[]): string {
  const out: string[] = []
  for (const arg of args) {
    if (!arg) continue
    if (typeof arg === 'function') continue
    if (typeof arg === 'string' || typeof arg === 'number') {
      out.push(String(arg))
      continue
    }
    if (Array.isArray(arg)) {
      const inner = cn(...arg)
      if (inner) out.push(inner)
      continue
    }
    for (const [key, value] of Object.entries(arg)) {
      if (value) out.push(key)
    }
  }
  return out.join(' ')
}
