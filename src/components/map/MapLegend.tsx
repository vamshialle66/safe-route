import { cn } from "@/lib/utils";

export function MapLegend() {
  const items = [
    ["bg-safe", "Mostly open (70+)"],
    ["bg-moderate", "Mixed (40–69)"],
    ["bg-risk", "Mostly closed (<40)"],
    ["bg-muted-foreground/50", "Not enough data"],
  ];
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-[500] rounded-xl border border-border bg-card/95 p-3 text-xs shadow-soft backdrop-blur">
      <p className="mb-1.5 font-semibold">Stretch index</p>
      <ul className="space-y-1">
        {items.map(([c, l]) => (
          <li key={l} className="flex items-center gap-2">
            <span className={cn("h-1.5 w-5 rounded-full", c)} /> {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
