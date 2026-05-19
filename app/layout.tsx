import type { Metadata } from 'next'
import { JetBrains_Mono, Mona_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const monaSans = Mona_Sans({
  variable: '--font-mona-sans',
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

const departureMono = localFont({
  src: './fonts/departure-mono/DepartureMono-Regular.woff2',
  variable: '--font-departure-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://francois.works'),
  title: {
    default: 'François Deguire',
    template: '%s — François Deguire',
  },
  description: 'Design engineer / creative developer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${monaSans.variable} ${jetbrainsMono.variable} ${departureMono.variable}`}
    >
      <body data-surface="default">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-[10px] focus:bg-pill-background focus:px-3 focus:py-2 focus:text-pill-foreground"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
