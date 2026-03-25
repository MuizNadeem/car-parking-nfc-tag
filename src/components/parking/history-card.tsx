import { Navigation2, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDateLogLine, formatTimeHms } from "@/lib/formatters";
import type { ParkingScan } from "@/types";

type HistoryCardProps = {
  history: ParkingScan[];
  removingScanId: string | null;
  removalBusy: boolean;
  onOpenMaps: (scan: ParkingScan) => void;
  onClearHistory: () => void;
  onDeleteScan: (scanId: string) => void;
  onScanRemoveAnimationEnd: (scanId: string) => void;
};

export function HistoryCard({
  history,
  removingScanId,
  removalBusy,
  onOpenMaps,
  onClearHistory,
  onDeleteScan,
  onScanRemoveAnimationEnd,
}: HistoryCardProps) {
  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-t border-border/90 pt-8">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          History
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={history.length === 0 || removalBusy}
          className={cn(
            "border-border bg-muted/50 text-foreground hover:bg-muted",
            history.length === 0 || removalBusy ? "cursor-not-allowed" : "",
          )}
          onClick={onClearHistory}
        >
          Clear all
        </Button>
      </div>

      {history.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No history on this device.
        </p>
      ) : (
        <div
          className="mt-6 max-h-[calc(100%-5rem)] overflow-y-auto overscroll-y-contain rounded-xl border border-border/60 bg-muted/20 px-1 py-1 [scrollbar-gutter:stable]"
          role="region"
          aria-label="Parking history list"
        >
          <ul className="list-none space-y-3 p-2">
            {history.map((scan, index) => {
              const isLatest = index === 0;
              const isRemoving = removingScanId === scan.id;
              const rankLabel =
                history.length > 1 && !isLatest
                  ? `#${history.length - index}`
                  : null;
              return (
                <li key={scan.id} className="overflow-hidden">
                  <div
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-[opacity,transform] duration-300 ease-out",
                      isLatest
                        ? "border-primary/40 bg-primary/10 shadow-[0_0_24px_hsl(var(--primary)/0.07)]"
                        : "border-border bg-muted/35",
                      isRemoving &&
                        "pointer-events-none opacity-0 -translate-x-3 scale-[0.97]",
                    )}
                    onTransitionEnd={(e) => {
                      if (e.target !== e.currentTarget) {
                        return;
                      }
                      if (e.propertyName !== "opacity") {
                        return;
                      }
                      if (!isRemoving) {
                        return;
                      }
                      onScanRemoveAnimationEnd(scan.id);
                    }}
                  >
                    <div className="min-w-0">
                      <p className="m-0 font-mono text-sm font-medium tabular-nums text-foreground">
                        {formatTimeHms(scan.timestamp)}
                      </p>
                      <p className="m-0 mt-0.5 text-xs text-muted-foreground">
                        {formatDateLogLine(scan.timestamp)}
                      </p>
                      {scan.placeLabel ? (
                        <p className="m-0 mt-1 line-clamp-2 text-pretty text-[11px] leading-snug text-muted-foreground">
                          {scan.placeLabel}
                        </p>
                      ) : (
                        <p className="m-0 mt-1 text-[11px] italic text-muted-foreground">
                          Looking up…
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                      {isLatest ? (
                        <Badge
                          variant="outline"
                          className="rounded-md border-primary/40 bg-primary/10 px-2 py-0 text-[9px] font-medium uppercase tracking-wider text-primary"
                        >
                          Latest
                        </Badge>
                      ) : (
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {rankLabel}
                        </span>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        className="border-border bg-muted/50 text-foreground hover:bg-muted"
                        disabled={removalBusy}
                        aria-label="Open this location in Google Maps"
                        onClick={() => onOpenMaps(scan)}
                      >
                        <Navigation2 className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        className="border-destructive/35 bg-destructive/10 text-destructive hover:bg-destructive/20"
                        disabled={removalBusy}
                        aria-label="Remove this entry from history"
                        onClick={() => onDeleteScan(scan.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
