import { Navigation2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatDateLogLine, formatRelativeAgo, formatTimeHms } from '@/lib/formatters'
import type { ParkingScan } from '@/types'

type LatestSpotCardProps = {
  latest: ParkingScan | undefined
  onOpenMaps: (scan: ParkingScan) => void
}

export function LatestSpotCard({ latest, onOpenMaps }: LatestSpotCardProps) {
  return (
    <section className="mt-12 space-y-1 text-center">
      <p className="m-0 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Last parked
      </p>
      {latest ? (
        <>
          <p className="mt-3 font-mono text-4xl font-semibold tabular-nums tracking-tight text-foreground">
            {formatTimeHms(latest.timestamp)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDateLogLine(latest.timestamp)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground/85">
            {formatRelativeAgo(latest.timestamp)}
          </p>
          {latest.placeLabel ? (
            <p className="mt-4 text-pretty text-sm leading-snug text-muted-foreground">
              {latest.placeLabel}
            </p>
          ) : (
            <p className="mt-4 text-sm italic text-muted-foreground/85">
              Looking up address…
            </p>
          )}
          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border bg-muted/50 text-foreground hover:bg-muted"
              onClick={() => onOpenMaps(latest)}
            >
              <Navigation2 className="size-3.5" aria-hidden />
              Maps
            </Button>
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          No scans yet. Scan your NFC tag to log a spot.
        </p>
      )}
    </section>
  )
}
