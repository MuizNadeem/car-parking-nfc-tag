export const formatDateTime = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp)
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date'
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

/** e.g. 17:56:54 */
export const formatTimeHms = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp)
  if (Number.isNaN(date.getTime())) {
    return '—:—:—'
  }
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

/** e.g. Wed 25 Mar 2026 */
export const formatDateLogLine = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** e.g. 1h 14m ago */
export const formatRelativeAgo = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  let diffMs = Date.now() - date.getTime()
  if (diffMs < 0) {
    diffMs = 0
  }
  const sec = Math.floor(diffMs / 1000)
  const min = Math.floor(sec / 60)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  if (day > 0) {
    return `${day}d ${hr % 24}h ago`
  }
  if (hr > 0) {
    return `${hr}h ${min % 60}m ago`
  }
  if (min > 0) {
    return `${min}m ago`
  }
  return 'Just now'
}

export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}
