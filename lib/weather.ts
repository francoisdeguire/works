import { z } from 'zod'
import { site } from '@/lib/site'

const OpenMeteoResponse = z.object({
  current: z.object({
    temperature_2m: z.number(),
    weather_code: z.number(),
  }),
})

export type WeatherSnapshot = {
  tempF: number
  condition: string
}

export async function getCurrentWeather(): Promise<WeatherSnapshot | null> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', site.location.coordinates.latitude.toString())
  url.searchParams.set('longitude', site.location.coordinates.longitude.toString())
  url.searchParams.set('current', 'temperature_2m,weather_code')
  url.searchParams.set('temperature_unit', 'fahrenheit')

  try {
    const response = await fetch(url, { next: { revalidate: 600 } })
    if (!response.ok) return null
    const json: unknown = await response.json()
    const parsed = OpenMeteoResponse.safeParse(json)
    if (!parsed.success) return null
    return {
      tempF: Math.round(parsed.data.current.temperature_2m),
      condition: codeToCondition(parsed.data.current.weather_code),
    }
  } catch {
    return null
  }
}

function codeToCondition(code: number): string {
  if (code <= 1) return 'SUNNY'
  if (code <= 3) return 'CLOUDY'
  if (code === 45 || code === 48) return 'FOG'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'RAIN'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'SNOW'
  if (code >= 95 && code <= 99) return 'STORM'
  return 'CLEAR'
}
