import { headers } from 'next/headers'
import { mailtoLinkProps, site } from '@/lib/site'
import { getCurrentWeather } from '@/lib/weather'
import LogoMark from './logo-mark'
import TerminalCardSurface from './terminal-card-surface'

const FAHRENHEIT_COUNTRIES = new Set(['US', 'GB'])

export default async function TerminalCard() {
  const [weather, headersList] = await Promise.all([getCurrentWeather(), headers()])

  const country = headersList.get('x-vercel-ip-country') ?? ''
  const useFahrenheit = FAHRENHEIT_COUNTRIES.has(country)

  return (
    <TerminalCardSurface className="tilt-card relative overflow-hidden max-sm:h-[40svh] sm:smooth-shadow-ring-xl sm:smooth-ring-gray-500/30 sm:rounded-[56px] sm:squircle-1.5 sm:border-10 sm:border-gray-50 bg-transparent sm:bg-radial-[at_50%_0%] sm:from-black sm:to-neutral-800 sm:p-8 py-4 font-display uppercase text-foreground sm:text-white">
      <div className="relative flex flex-col h-full sm:h-80 sm:justify-between">
        <div className="flex flex-col sm:flex-row max-sm:flex-1 min-h-0">
          <div className="flex-1 max-sm:hidden">
            <LogoMark size={30} />
          </div>
          <div className="flex max-sm:flex-1 items-center justify-center min-h-0">
            <a
              {...mailtoLinkProps}
              className="group relative inline-block rounded-xs max-sm:mb-4 max-sm:underline underline-offset-3 text-xl sm:text-2xl leading-none focus-visible:outline-2 focus-visible:outline-offset-4 sm:focus-visible:outline-white"
            >
              <span className="block px-[0.4em] py-[0.18em]">{site.email}</span>
              <span
                aria-hidden
                className="absolute inset-0 hidden sm:block px-[0.4em] py-[0.18em] bg-white text-black [clip-path:inset(0_100%_0_0)] transition-[clip-path] delay-100 duration-200 ease-emphasized group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
              >
                {site.email}
              </span>
            </a>
          </div>
        </div>

        <div className="flex justify-between text-foreground-muted sm:text-white/80 ">
          <div className="self-end text-sm sm:text-base -mb-0.5">
            <p>Made with love</p>
            <p>(and matcha)</p>
          </div>
          <div className="self-end justify-self-end text-right text-sm sm:text-base -mb-0.5">
            <p>Based in MTL</p>
            {weather ? (
              <p>
                {weather.condition}
                {' ∙ '}
                {useFahrenheit
                  ? `${Math.round((weather.tempC * 9) / 5 + 32)}°F`
                  : `${weather.tempC}°C`}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </TerminalCardSurface>
  )
}
