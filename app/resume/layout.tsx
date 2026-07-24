import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import './resume.css'

// Chrome's print backend emits Type 3 glyph procedures for variable fonts, which ATS parsers choke on
const monaSansStatic = localFont({
  src: [
    { path: '../fonts/mona-sans/MonaSans-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/mona-sans/MonaSans-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-mona-sans-static',
  display: 'swap',
})

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return <div className={monaSansStatic.variable}>{children}</div>
}
