import type { ParseResult } from '../types'

const LATITUDE_KEYS = ['lat', 'latitude'] as const
const LONGITUDE_KEYS = ['lng', 'lon', 'longitude'] as const

const getParamValue = (
  params: URLSearchParams,
  aliases: readonly string[],
): string | null => {
  for (const key of aliases) {
    const value = params.get(key)
    if (value !== null && value !== '') {
      return value
    }
  }

  return null
}

export const parseScanFromSearch = (search: string): ParseResult => {
  const params = new URLSearchParams(search)
  const rawLat = getParamValue(params, LATITUDE_KEYS)
  const rawLng = getParamValue(params, LONGITUDE_KEYS)

  const hasAnyRelevantParams = [rawLat, rawLng].some((value) => value !== null)

  if (!hasAnyRelevantParams) {
    return { hasAnyRelevantParams, scan: null, error: null }
  }

  if (rawLat === null || rawLng === null) {
    return {
      hasAnyRelevantParams,
      scan: null,
      error: 'Scan URL is missing latitude or longitude.',
    }
  }

  const lat = Number(rawLat)
  const lng = Number(rawLng)
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    return {
      hasAnyRelevantParams,
      scan: null,
      error: 'Latitude is invalid. Expected a number between -90 and 90.',
    }
  }

  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    return {
      hasAnyRelevantParams,
      scan: null,
      error: 'Longitude is invalid. Expected a number between -180 and 180.',
    }
  }

  // Always use device time when saving a parking event.
  const timestamp = new Date().toISOString()

  const idSeed = `${timestamp}-${lat.toFixed(6)}-${lng.toFixed(6)}`
  return {
    hasAnyRelevantParams,
    error: null,
    scan: {
      id: idSeed,
      timestamp,
      lat,
      lng,
      savedAt: new Date().toISOString(),
    },
  }
}
