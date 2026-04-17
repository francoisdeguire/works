'use client'

import { useEffect, useState } from 'react'
import { site } from '@/lib/site'

const PLACEHOLDER = '——:——:—— ——'

const formatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
  timeZone: site.location.timeZone,
})

export default function TerminalClock() {
  const [time, setTime] = useState<string>(PLACEHOLDER)

  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()))
    update()
    const id = window.setInterval(update, 1000)
    return () => window.clearInterval(id)
  }, [])

  return <span suppressHydrationWarning>{time}</span>
}
