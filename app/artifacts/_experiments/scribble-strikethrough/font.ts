import { Manrope } from 'next/font/google'

// scoped to this demo via manrope.variable on the root, not the global <html>
export const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
})
