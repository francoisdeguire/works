import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useBrowserPathname() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // The prerendered not-found page has no real path, so stay empty until
  // mounted to avoid a hydration mismatch; usePathname then tracks back/forward.
  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? pathname : ''
}
