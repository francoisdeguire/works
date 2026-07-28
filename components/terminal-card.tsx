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
    <TerminalCardSurface className="tilt-card relative overflow-hidden max-sm:h-[40svh] sm:shadow-xl sm:rounded-4xl bg-transparent sm:bg-black sm:p-8 py-4 font-display uppercase text-foreground sm:text-white">
      <div className="relative flex flex-col h-full sm:h-80 sm:justify-between">
        <div className="flex flex-col sm:flex-row max-sm:flex-1 min-h-0">
          <div className="flex-1 max-sm:hidden">
            <LogoMark size={30} />
          </div>
          <div className="flex max-sm:flex-1 items-center justify-center min-h-0">
            <a
              {...mailtoLinkProps}
              className="max-sm:mb-4 max-sm:underline underline-offset-3 text-xl sm:text-2xl leading-none transition-opacity duration-100 hover:text-foreground/80 sm:hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-4 sm:focus-visible:outline-white"
            >
              {site.email}
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
