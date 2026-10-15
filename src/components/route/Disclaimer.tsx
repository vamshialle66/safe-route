import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("flex gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground", className)}>
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      The index is an experimental measure: the share of nearby places along each stretch that are open right now. It's extra context, not a guarantee that any route is safe.
    </p>
  );
}

export function SourceBadge({ source }: { source: "live" | "demo" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        source === "live" ? "bg-safe-soft text-safe" : "bg-moderate-soft text-moderate-foreground",
      )}
    >
      <span className={cn("size-1.5 rounded-full", source === "live" ? "bg-safe animate-pulse" : "bg-moderate")} />
      {source === "live" ? "Live data" : "Sample data"}
    </span>
  );
}
