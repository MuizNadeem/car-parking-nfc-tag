import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react'

import { fetchPlaceLabel } from '@/lib/reverseGeocode'
import { getHistory, writeHistory } from '@/lib/storage'
import type { ParkingScan } from '@/types'

const NOMINATIM_MIN_INTERVAL_MS = 1100

/**
 * Fetches missing `placeLabel` values via Nominatim, one at a time (rate limit friendly).
 */
export function useResolvePlaceLabels(
  history: ParkingScan[],
  setHistory: Dispatch<SetStateAction<ParkingScan[]>>,
): void {
  const effectGenerationRef = useRef(0)

  const fingerprint = history
    .map((s) => `${s.id}:${s.placeLabel ?? ''}`)
    .join('|')

  useEffect(() => {
    const missing = getHistory().filter((s) => !s.placeLabel)
    if (missing.length === 0) {
      return
    }

    const generation = ++effectGenerationRef.current
    let cancelled = false

    void (async () => {
      for (const scan of missing) {
        if (cancelled || generation !== effectGenerationRef.current) {
          return
        }

        await new Promise<void>((resolve) => {
          setTimeout(resolve, NOMINATIM_MIN_INTERVAL_MS)
        })

        if (cancelled || generation !== effectGenerationRef.current) {
          return
        }

        const stillMissing = getHistory().find(
          (s) => s.id === scan.id && !s.placeLabel,
        )
        if (!stillMissing) {
          continue
        }

        const label = await fetchPlaceLabel(scan.lat, scan.lng)

        if (cancelled || generation !== effectGenerationRef.current || !label) {
          continue
        }

        setHistory((prev) => {
          const exists = prev.some((s) => s.id === scan.id && !s.placeLabel)
          if (!exists) {
            return prev
          }
          const next = prev.map((s) =>
            s.id === scan.id && !s.placeLabel ? { ...s, placeLabel: label } : s,
          )
          writeHistory(next)
          return next
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [fingerprint, setHistory])
}
