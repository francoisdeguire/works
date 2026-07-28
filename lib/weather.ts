import { z } from 'zod'
import { site } from '@/lib/site'

const OpenMeteoResponse = z.object({
  current: z.object({
    temperature_2m: z.number(),
    weather_code: z.number(),
  }),
})

export type WeatherSnapshot = {
  tempC: number
  condition: string
}

const REVALIDATE_SECONDS = 600
const REQUEST_TIMEOUT_MS = 3000

export async function getCurrentWeather(): Promise<WeatherSnapshot | null> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', site.location.coordinates.latitude.toString())
  url.searchParams.set('longitude', site.location.coordinates.longitude.toString())
  url.searchParams.set('current', 'temperature_2m,weather_code')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: controller.signal,
    })
    if (!response.ok) return null
    const json: unknown = await response.json()
    const parsed = OpenMeteoResponse.safeParse(json)
    if (!parsed.success) return null
    return {
      tempC: Math.round(parsed.data.current.temperature_2m),
      condition: codeToCondition(parsed.data.current.weather_code),
    }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

function codeToCondition(code: number): string {
  if (code <= 1) return 'Sunny'
  if (code <= 3) return 'Cloudy'
  if (code === 45 || code === 48) return 'Fog'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'Rain'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'Snow'
  if (code >= 95 && code <= 99) return 'Storm'
  return 'Clear'
}
