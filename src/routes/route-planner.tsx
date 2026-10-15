import { useCallback, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownUp, ArrowRight, Bookmark, Crosshair, Flag, Loader2, MapPin, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { RouteMap } from "@/components/map/RouteMap";
import { PlaceSearch } from "@/components/common/PlaceSearch";
import { Button } from "@/components/ui/button";
import { IndexRing, IndexPill } from "@/components/route/IndexPill";
import { Disclaimer, SourceBadge } from "@/components/route/Disclaimer";
import { analysisStore, useCurrentAnalysis, type NamedPoint } from "@/lib/analysisStore";
import { currentPosition, SAMPLE_DESTINATION, SAMPLE_ORIGIN } from "@/lib/geocode";
import { runAnalysis } from "@/lib/runAnalysis";
import {
  TRAVEL_MODES,
  formatDistance,
  formatDuration,
  topRouteNumbers,
  type BackendTravelMode,
} from "@/lib/saferouteApi";
import { cn } from "@/lib/utils";
import { MiniHero } from "@/components/layout/MiniHero";
import { MapLegend } from "@/components/map/MapLegend";

export const Route = createFileRoute("/route-planner")({
  head: () => ({
    meta: [
      { title: "Plan a Route — SafeRoute" },
      { name: "description", content: "Enter a start and destination to compare alternative routes by how many places along the way are open right now." },
      { property: "og:title", content: "Plan a Route — SafeRoute" },
      { property: "og:description", content: "Compare alternative routes segment by segment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlannerPage,
});

const STAGES = ["Finding alternative routes", "Splitting routes into ~100 m stretches", "Looking up places along each stretch", "Scoring every stretch"];

function PlannerPage() {
  const analysis = useCurrentAnalysis();
  const [origin, setOrigin] = useState<NamedPoint | null>(analysis?.origin ?? null);
  const [destination, setDestination] = useState<NamedPoint | null>(analysis?.destination ?? null);
  const [mode, setMode] = useState<BackendTravelMode>(analysis?.travelMode ?? "WALK");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [locating, setLocating] = useState(false);
  const [selected, setSelected] = useState<number | undefined>(analysis?.routes[0]?.routeNumber);

  const routes = analysis?.routes ?? [];
  const best = topRouteNumbers(routes);
  const sorted = [...routes].sort((a, b) => (b.safetyIndex ?? -1) - (a.safetyIndex ?? -1));
  const onSelect = useCallback((n: number) => setSelected(n), []);

  async function analyze() {
    if (!origin || !destination) {
      toast.error("Pick a start and a destination from the suggestions.");
      return;
    }
    setLoading(true);
    setStage(0);
    const timer = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 1600);
    try {
      const { analysis: a, fellBack } = await runAnalysis(origin, destination, mode);
      const top = [...topRouteNumbers(a.routes)][0] ?? a.routes[0]?.routeNumber;
      setSelected(top);
      if (!a.routes.length) toast.message("No routes were found between these places.");
      else if (fellBack) toast.warning("Couldn't reach the SafeRoute engine — showing sample data. You can set its address in Settings.");
      else toast.success(`${a.routes.length} routes analysed`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  async function useMyLocation() {
    setLocating(true);
    try {
      setOrigin(await currentPosition());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Location unavailable");
    } finally {
      setLocating(false);
    }
  }

  return (
    <AppLayout title="Plan Route" fullBleed>
      <MiniHero className="m-4 mb-0 lg:hidden" title="Plan Route" description="Where are you heading? We compare up to five routes and score each stretch." />
      <div className="flex flex-col pt-4 lg:h-[calc(100vh-4rem)] lg:flex-row lg:pt-0">
        <section className="order-2 flex w-full flex-col border-r border-border bg-card lg:order-1 lg:w-[420px] lg:overflow-y-auto">
          <div className="space-y-4 border-b border-border p-5">
            <MiniHero className="hidden lg:block" title="Plan Route" description="Where are you heading? We compare up to five routes and score each stretch." />
            <div className="space-y-1">
              <PlaceSearch
                label="Start"
                icon={MapPin}
                value={origin}
                onChange={setOrigin}
                placeholder="Search a place or paste lat, lng"
                trailing={
                  <Button type="button" variant="ghost" size="icon" className="size-10" onClick={useMyLocation} aria-label="Use my current location" disabled={locating}>
                    {locating ? <Loader2 className="size-4 animate-spin" /> : <Crosshair className="size-4" />}
                  </Button>
                }
              />
              <div className="flex items-center gap-2 py-1">
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-full bg-card px-4"
                  aria-label="Swap start and destination"
                  onClick={() => {
                    setOrigin(destination);
                    setDestination(origin);
                  }}
                >
                  <ArrowDownUp className="size-4" /> Swap
                </Button>
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </div>
              <PlaceSearch label="Destination" icon={Flag} value={destination} onChange={setDestination} placeholder="Where to?" />
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">Travel mode</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Travel mode">
                {TRAVEL_MODES.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    role="radio"
                    aria-checked={mode === m.value}
                    onClick={() => setMode(m.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      mode === m.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-accent",
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={analyze} disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {loading ? STAGES[stage] + "…" : "Analyse routes"}
            </Button>
            {!origin && !destination && (
              <button
                type="button"
                className="w-full text-center text-xs text-primary hover:underline"
                onClick={() => {
                  setOrigin(SAMPLE_ORIGIN);
                  setDestination(SAMPLE_DESTINATION);
                }}
              >
                Try a sample trip in Mumbai
              </button>
            )}
          </div>

          <div className="flex-1 space-y-3 p-5">
            {loading && (
              <ol className="space-y-2">
                {STAGES.map((s, i) => (
                  <li key={s} className={cn("flex items-center gap-2 text-sm", i <= stage ? "text-foreground" : "text-muted-foreground/60")}>
                    <span className={cn("size-2 rounded-full", i < stage ? "bg-safe" : i === stage ? "animate-pulse bg-primary" : "bg-muted")} />
                    {s}
                  </li>
                ))}
              </ol>
            )}

            {!loading && analysis && routes.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">{routes.length} routes compared</h2>
                  <SourceBadge source={analysis.source} />
                </div>
                {sorted.map((r) => {
                  const isSel = r.routeNumber === selected;
                  const isBest = best.has(r.routeNumber);
                  return (
                    <div
                      key={r.routeNumber}
                      className={cn(
                        "w-full rounded-2xl border p-4 text-left transition-all",
                        isSel ? "border-primary bg-primary-soft shadow-soft" : "border-border bg-background hover:border-primary/40",
                      )}
                    >
                      <button type="button" className="flex w-full items-center gap-4 text-left" onClick={() => setSelected(r.routeNumber)}>
                        <IndexRing value={r.safetyIndex} size={56} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display font-semibold">Route {r.routeNumber}</span>
                            {isBest && (
                              <span className="rounded-full bg-safe px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">Highest index</span>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {formatDistance(r.distanceMeters)} · {formatDuration(r.duration)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {r.segments.length} stretches · {r.scoredSegmentCount} with data
                          </p>
                        </div>
                      </button>
                      {isSel && (
                        <div className="mt-3 flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link to="/routes/$id" params={{ id: String(r.routeNumber) }}>
                              Details <ArrowRight className="size-3.5" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const ok = analysisStore.saveRoute(analysis, r.routeNumber);
                              toast[ok ? "success" : "message"](ok ? "Route saved" : "Already saved");
                            }}
                          >
                            <Bookmark className="size-3.5" /> Save
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
                <Button asChild variant="outline" className="w-full">
                  <Link to="/routes">Compare side by side</Link>
                </Button>
                <Disclaimer />
              </>
            )}

            {!loading && !analysis && (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Your routes will appear here once you analyse a trip.
              </div>
            )}
          </div>
        </section>

        <section className="relative order-1 h-[45vh] min-h-[300px] flex-none sm:h-[52vh] lg:flex-1 lg:order-2 lg:h-auto">
          <RouteMap
            routes={routes}
            selectedRoute={selected}
            onSelectRoute={onSelect}
            origin={origin ?? undefined}
            destination={destination ?? undefined}
          />
          <MapLegend />
        </section>
      </div>
    </AppLayout>
  );
}

