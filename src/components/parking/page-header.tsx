import { cn } from "@/lib/utils";

type PageHeaderProps = {
  hasLatest: boolean;
  className?: string;
};

export function PageHeader({ hasLatest, className }: PageHeaderProps) {
  return (
    <header className={cn("relative text-center", className)}>
      <div className="flex items-start justify-between px-0.5">
        <p className="m-0 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Car park log
        </p>
        <span
          className={cn(
            "size-2 shrink-0 rounded-full",
            hasLatest
              ? "bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.55)]"
              : "bg-muted-foreground/35",
          )}
          aria-hidden
        />
      </div>
    </header>
  );
}
