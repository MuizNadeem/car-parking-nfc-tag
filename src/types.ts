export type ParkingScan = {
  id: string
  timestamp: string
  lat: number
  lng: number
  savedAt: string
  /** Filled by reverse geocode (OpenStreetMap Nominatim), optional on older records */
  placeLabel?: string
}

export type ParseResult = {
  hasAnyRelevantParams: boolean
  scan: ParkingScan | null
  error: string | null
}
