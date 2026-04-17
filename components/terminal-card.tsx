import { site } from '@/lib/site'
import { getCurrentWeather } from '@/lib/weather'
import LogoMark from './logo-mark'
import TerminalClock from './terminal-clock'

export default async function TerminalCard() {
  const weather = await getCurrentWeather()

  return (
    <div className="rounded-card bg-black p-8 font-display text-white">
      <div className="grid min-h-72 grid-cols-2 gap-y-16">
        <div className="self-start">
          <LogoMark size={32} />
        </div>
        <a
          href={`mailto:${site.email}`}
          className="self-start justify-self-end text-subtitle transition-opacity duration-fast hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {site.email.toUpperCase()} ↗
        </a>
        <div className="self-end text-subtitle">
          <p>MADE WITH LOVE</p>
          <p>(AND MATCHA)</p>
        </div>
        <div className="self-end justify-self-end text-right text-subtitle">
          <p>
            <TerminalClock />
          </p>
          {weather ? <p>{`${weather.condition} • ${weather.tempF}°F`}</p> : null}
        </div>
      </div>
    </div>
  )
}
