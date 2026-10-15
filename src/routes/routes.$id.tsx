import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Navigation, Clock, MapPin, Route as RouteIcon, Store } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { RouteMap } from "@/components/map/RouteMap";
import { Button } from "@/components/ui/button";
import { IndexPill, IndexRing, TONE_CLASSES } from "@/components/route/IndexPill";
import { Disclaimer, SourceBadge } from "@/components/route/Disclaimer";
import { EmptyState } from "@/components/common/EmptyState";
import { analysisStore, useCurrentAnalysis } from "@/lib/analysisStore";
import { formatDistance, formatDuration, formatIndex, indexTone } from "@/lib/saferouteApi";
import { cn } from "@/lib/utils";
import { googleDirectionsUrl } from "@/lib/directions";

export const Route = createFileRoute("/routes/$id")({
  head: () => ({
    meta: [
      { title: "Route Details — SafeRoute" },
      { name: "description", content: "Stretch-by-stretch breakdown of a route: places nearby, how many are open, and the experimental index." },
      { property: "og:title", content: "Route Details — SafeRoute" },
      { property: "og:description", content: "See every stretch of your route." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RouteDetail,
});

function RouteDetail() {
  const { id } = Route.useParams();
  const analysis = useCurrentAnalysis();
  const route = analysis?.routes.find((r) => String(r.routeNumber) === id);
  const [hl, setHl] = useState<number | undefined>();

  if (!analysis || !route) {
    return (
      <AppLayout title="Route details">
        <EmptyState
          icon={RouteIcon}
          title="No route to show yet"
          description="Analyse a trip first, then open any route for its full breakdown."
          action={<Button asChild><Link to="/route-planner">Plan a route</Link></Button>}
        />
      </AppLayout>
    );
  }

  const chart = route.segments.map((s) => ({ n: s.segmentNumber, v: s.safetyIndex ?? 0, has: s.safetyIndex != null, tone: indexTone(s.safetyIndex) }));
  const totalPlaces = route.segments.reduce((a, s) => a + s.placeCount, 0);
  const openPlaces = route.segments.reduce((a, s) => a + s.openPlaceCount, 0);
  const lowStretches = route.segments.filter((s) => indexTone(s.safetyIndex) === "risk");
  const coverage = route.distanceMeters ? Math.round((route.scoredLengthMeters / route.distanceMeters) * 100) : 0;

  return (
    <AppLayout
      title={`Route ${route.routeNumber}`}
      description={`${analysis.origin.label.split(",")[0]} → ${analysis.destination.label.split(",")[0]}`}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button asChild className="bg-safe text-safe-foreground hover:bg-safe/90">
            <a href={googleDirectionsUrl(analysis.origin, analysis.destination, analysis.travelMode, route)} target="_blank" rel="noopener noreferrer">
              <Navigation className="size-4" /> Directions
            </a>
          </Button>
          <Button asChild variant="outline"><Link to="/routes"><ArrowLeft className="size-4" /> All routes</Link></Button>
          <Button onClick={() => toast[analysisStore.saveRoute(analysis, route.routeNumber) ? "success" : "message"]("Saved to your routes")}>
            <Bookmark className="size-4" /> Save
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="relative h-[300px] sm:h-[380px] overflow-hidden rounded-2xl border border-border">
            <RouteMap routes={[route]} selectedRoute={route.routeNumber} highlightSegment={hl} origin={analysis.origin} destination={analysis.destination} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">Index along the route</h2>
              <span className="text-xs text-muted-foreground">Each bar is one stretch, start → finish</span>
            </div>
            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart} onMouseMove={(s) => setHl(s?.activeLabel ? Number(s.activeLabel) : undefined)} onMouseLeave={() => setHl(undefined)}>
                  <XAxis dataKey="n" tick={false} axisLine={false} />
                  <YAxis domain={[0, 100]} width={28} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    formatter={(v: number, _n, p) => [p.payload.has ? v.toFixed(0) : "N/A", "Index"]}
                    labelFormatter={(l) => `Stretch ${l}`}
                    contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
                  />
                  <Bar dataKey="v" radius={[3, 3, 0, 0]} minPointSize={3}>
                    {chart.map((c) => (
                      <Cell key={c.n} fill={c.tone === "none" ? "var(--muted-foreground)" : `var(--${c.tone})`} fillOpacity={c.has ? 0.9 : 0.25} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card">
            <h2 className="border-b border-border px-5 py-4 font-display font-semibold">Stretch by stretch</h2>
            <ul className="divide-y divide-border">
              {route.segments.map((s) => {
                const tone = indexTone(s.safetyIndex);
                return (
                  <li key={s.segmentNumber} onMouseEnter={() => setHl(s.segmentNumber)} onMouseLeave={() => setHl(undefined)} className={cn("flex items-center gap-4 px-5 py-3 transition-colors", hl === s.segmentNumber && "bg-accent")}>
                    <span className={cn("h-8 w-1 rounded-full", TONE_CLASSES[tone].bar)} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Stretch {s.segmentNumber} <span className="font-normal text-muted-foreground">· {formatDistance(s.lengthMeters)}</span></p>
                      <p className="truncate text-xs text-muted-foreground">
                        {s.placeCount === 0 ? "No places found nearby" : `${s.openPlaceCount} of ${s.scoredPlaceCount} open · ${s.places.slice(0, 3).map((p) => p.name).join(", ")}`}
                      </p>
                    </div>
                    <IndexPill value={s.safetyIndex} showLabel={false} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Route index</span>
              <SourceBadge source={analysis.source} />
            </div>
            <div className="mt-3 flex items-center gap-4">
              <IndexRing value={route.safetyIndex} size={88} />
              <div>
                <p className={cn("font-display text-lg font-semibold", TONE_CLASSES[indexTone(route.safetyIndex)].text)}>{TONE_CLASSES[indexTone(route.safetyIndex)].label}</p>
                <p className="text-xs text-muted-foreground">Length-weighted across {route.scoredSegmentCount} scored stretches</p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Stat icon={RouteIcon} label="Distance" value={formatDistance(route.distanceMeters)} />
              <Stat icon={Clock} label="Duration" value={formatDuration(route.duration)} />
              <Stat icon={Store} label="Places found" value={`${openPlaces}/${totalPlaces} open`} />
              <Stat icon={MapPin} label="Data coverage" value={`${coverage}%`} />
            </dl>
          </div>

          {lowStretches.length > 0 && (
            <div className="rounded-2xl border border-risk/30 bg-risk-soft p-5">
              <p className="font-semibold text-risk">{lowStretches.length} quiet stretch{lowStretches.length > 1 ? "es" : ""}</p>
              <p className="mt-1 text-sm text-foreground/80">
                Fewer than 40% of nearby places are open on {formatDistance(lowStretches.reduce((a, s) => a + s.lengthMeters, 0))} of this route. Consider sharing your trip with a contact.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3 bg-card"><Link to="/emergency">Emergency tools</Link></Button>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-5 text-sm">
            <p className="font-semibold">How this is worked out</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-muted-foreground">
              <li>Route split into stretches of about 100 m.</li>
              <li>A 20 m-wide band drawn around each stretch.</li>
              <li>Places inside the band are counted.</li>
              <li>Index = % of those places open right now.</li>
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">Overall index {formatIndex(route.safetyIndex)} weights longer stretches more.</p>
          </div>
          <Disclaimer />
        </aside>
      </div>
    </AppLayout>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="size-3.5" />{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
