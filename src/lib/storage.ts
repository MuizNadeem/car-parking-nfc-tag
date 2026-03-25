import type { ParkingScan } from '../types'

export const STORAGE_KEY = 'car-park-history-v1'
export const HISTORY_LIMIT = 20

const isValidRecord = (item: unknown): item is ParkingScan => {
  if (typeof item !== 'object' || item === null) {
    return false
  }

  const candidate = item as Partial<ParkingScan>
  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.timestamp !== 'string' ||
    typeof candidate.savedAt !== 'string' ||
    typeof candidate.lat !== 'number' ||
    typeof candidate.lng !== 'number'
  ) {
    return false
  }
  if (
    candidate.placeLabel !== undefined &&
    typeof candidate.placeLabel !== 'string'
  ) {
    return false
  }
  return true
}

const normalizeHistory = (rawValue: unknown): ParkingScan[] => {
  if (!Array.isArray(rawValue)) {
    return []
  }

  return rawValue.filter(isValidRecord).slice(0, HISTORY_LIMIT)
}

export const writeHistory = (history: ParkingScan[]): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export const getHistory = (): ParkingScan[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)
    const history = normalizeHistory(parsed)

    if (Array.isArray(parsed) && history.length !== parsed.length) {
      writeHistory(history)
    }

    return history
  } catch {
    return []
  }
}

export const addScanToHistory = (scan: ParkingScan): ParkingScan[] => {
  const existing = getHistory()
  const deduped = existing.filter(
    (item) =>
      !(
        item.timestamp === scan.timestamp &&
        item.lat === scan.lat &&
        item.lng === scan.lng
      ),
  )
  const nextHistory = [scan, ...deduped].slice(0, HISTORY_LIMIT)
  writeHistory(nextHistory)
  return nextHistory
}

export const clearHistory = (): void => {
  window.localStorage.removeItem(STORAGE_KEY)
}

export const removeScanById = (id: string): ParkingScan[] => {
  const next = getHistory().filter((item) => item.id !== id)
  writeHistory(next)
  return next
}
