/** Nominatim reverse JSON (format=jsonv2) — subset we use */
type NominatimAddress = {
  road?: string
  pedestrian?: string
  suburb?: string
  neighbourhood?: string
  quarter?: string
  city?: string
  town?: string
  village?: string
  state?: string
  region?: string
  country?: string
}

type NominatimReverseResponse = {
  display_name: string
  address?: NominatimAddress
}

const MAX_LABEL_LENGTH = 80

function shorten(text: string): string {
  const t = text.trim()
  if (t.length <= MAX_LABEL_LENGTH) {
    return t
  }
  return `${t.slice(0, MAX_LABEL_LENGTH - 1)}…`
}

function buildFromAddress(
  address: NominatimAddress | undefined,
  fallbackDisplay: string,
): string {
  if (!address) {
    return shorten(fallbackDisplay.split(',').slice(0, 3).join(',').trim())
  }

  const street = address.road || address.pedestrian || ''
  const near = [
    address.suburb,
    address.neighbourhood,
    address.quarter,
  ].find(Boolean)
  const locality =
    address.city || address.town || address.village || address.region

  const parts: string[] = []
  if (street) {
    parts.push(street)
  }
  if (near) {
    parts.push(near)
  }
  if (locality && locality !== near) {
    parts.push(locality)
  }

  if (parts.length > 0) {
    return shorten(parts.join(', '))
  }

  parts.length = 0
  if (locality) {
    parts.push(locality)
  }
  if (address.state && address.state !== locality) {
    parts.push(address.state)
  }
  if (parts.length > 0) {
    return shorten(parts.join(', '))
  }

  return shorten(fallbackDisplay.split(',').slice(0, 3).join(',').trim())
}

/**
 * Resolve coordinates to a short place name using OpenStreetMap Nominatim.
 * @see https://nominatim.org/release-docs/develop/api/Reverse/
 *
 * Note: Nominatim asks for at most ~1 request/second for client apps; callers should throttle.
 * Browsers cannot set a custom User-Agent on fetch; use is acceptable for light personal use.
 */
export async function fetchPlaceLabel(lat: number, lng: number): Promise<string | null> {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(lat),
    lon: String(lng),
  })
  const url = `https://nominatim.openstreetmap.org/reverse?${params.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': typeof navigator !== 'undefined' ? navigator.language : 'en',
      },
    })

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as NominatimReverseResponse
    if (!data.display_name) {
      return null
    }

    return buildFromAddress(data.address, data.display_name)
  } catch {
    return null
  }
}
