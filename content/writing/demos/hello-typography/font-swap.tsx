'use client'

import { useState } from 'react'

const DEPARTURE = {
  font: 'font-display',
  label: 'Departure Mono',
  value: 'HELLO TYPOGRAPHY',
}
const MONA = {
  font: 'font-sans',
  label: 'Mona Sans',
  value: 'Hello typography',
}

export default function HelloTypographyFontSwap() {
  const [showMona, setShowMona] = useState(false)
  const current = showMona ? MONA : DEPARTURE
  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className={`${current.font} text-2xl text-foreground`}>{current.value}</div>
      <button
        type="button"
        onClick={() => setShowMona((v) => !v)}
        className="rounded border border-border-subtle bg-background px-3 py-1 font-sans text-sm text-foreground-muted transition-colors hover:bg-surface-2 hover:text-foreground"
      >
        showing: {current.label}
      </button>
    </div>
  )
}
