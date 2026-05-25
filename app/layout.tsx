import type { Metadata } from 'next'
import { JetBrains_Mono, Mona_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import SiteHeader from '@/components/site-header'
import { site } from '@/lib/site'
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
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${monaSans.variable} ${jetbrainsMono.variable} ${departureMono.variable}`}
    >
      <body data-surface="default">
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
