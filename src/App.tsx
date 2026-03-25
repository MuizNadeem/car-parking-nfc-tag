import { useMemo, useState } from 'react'
import { ConfirmDialog } from '@/components/parking/confirm-dialog'
import { HistoryCard } from '@/components/parking/history-card'
import { LatestSpotCard } from '@/components/parking/latest-spot-card'
import { PageHeader } from '@/components/parking/page-header'

import { useResolvePlaceLabels } from '@/hooks/useResolvePlaceLabels'
import { parseScanFromSearch } from '@/lib/scanParser'
import {
  addScanToHistory,
  clearHistory,
  getHistory,
  removeScanById,
} from '@/lib/storage'
import type { ParkingScan } from '@/types'

type ConfirmIntent =
  | { kind: 'none' }
  | { kind: 'clear-all' }
  | { kind: 'delete-scan'; scanId: string }

function App() {
  const parseResult = useMemo(
    () => parseScanFromSearch(window.location.search),
    [],
  )
  const [history, setHistory] = useState<ParkingScan[]>(() => {
    const existingHistory = getHistory()
    if (!parseResult.hasAnyRelevantParams) {
      return existingHistory
    }

    if (parseResult.error || !parseResult.scan) {
      if (parseResult.error) {
        console.warn('[nfc-car-tag]', parseResult.error)
      }
      return existingHistory
    }

    return addScanToHistory(parseResult.scan)
  })

  useResolvePlaceLabels(history, setHistory)

  const [confirmIntent, setConfirmIntent] = useState<ConfirmIntent>({
    kind: 'none',
  })
  const [removingScanId, setRemovingScanId] = useState<string | null>(null)

  const latest = history[0]

  const openInMaps = (scan: ParkingScan): void => {
    const mapsUrl = `https://maps.google.com/?q=${scan.lat},${scan.lng}`
    window.open(mapsUrl, '_blank', 'noopener,noreferrer')
  }

  const requestClearHistory = (): void => {
    setConfirmIntent({ kind: 'clear-all' })
  }

  const requestDeleteScan = (scanId: string): void => {
    setConfirmIntent({ kind: 'delete-scan', scanId })
  }

  const finalizeScanRemoval = (scanId: string): void => {
    setRemovingScanId(null)
    setHistory(removeScanById(scanId))
  }

  const handleConfirmIntent = (): void => {
    if (confirmIntent.kind === 'clear-all') {
      clearHistory()
      setHistory([])
    } else if (confirmIntent.kind === 'delete-scan') {
      const scanId = confirmIntent.scanId
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setHistory(removeScanById(scanId))
      } else {
        setRemovingScanId(scanId)
      }
    }
    setConfirmIntent({ kind: 'none' })
  }

  const confirmOpen = confirmIntent.kind !== 'none'
  const confirmCopy =
    confirmIntent.kind === 'clear-all'
      ? {
          title: 'Clear all history?',
          description:
            'This removes every saved parking entry from this browser. This cannot be undone.',
          confirmLabel: 'Clear all',
        }
      : confirmIntent.kind === 'delete-scan'
        ? {
            title: 'Remove this entry?',
            description:
              'This parking log will be removed from history on this device.',
            confirmLabel: 'Remove',
          }
        : { title: '', description: '', confirmLabel: 'Confirm' }

  return (
    <div className="dark app-shell-bg h-dvh overflow-hidden text-foreground antialiased">
      <main className="mx-auto flex h-full w-full max-w-md flex-col px-5 pb-4 pt-8">
        <PageHeader hasLatest={Boolean(latest)} />
        <LatestSpotCard latest={latest} onOpenMaps={openInMaps} />
        <div className="mt-6 min-h-0 flex-1">
          <HistoryCard
            history={history}
            removingScanId={removingScanId}
            removalBusy={removingScanId !== null}
            onOpenMaps={openInMaps}
            onClearHistory={requestClearHistory}
            onDeleteScan={requestDeleteScan}
            onScanRemoveAnimationEnd={finalizeScanRemoval}
          />
        </div>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setConfirmIntent({ kind: 'none' })
            }
          }}
          title={confirmCopy.title}
          description={confirmCopy.description}
          confirmLabel={confirmCopy.confirmLabel}
          cancelLabel="Cancel"
          destructive
          onConfirm={handleConfirmIntent}
        />

        <footer className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
          Tap your NFC tag each time you park — stored only in this browser.
        </footer>
      </main>
    </div>
  )
}

export default App
