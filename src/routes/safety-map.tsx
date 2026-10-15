import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Crosshair, Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { MiniHero } from "@/components/layout/MiniHero";
import { RouteMap } from "@/components/map/RouteMap";
import { Button } from "@/components/ui/button";
import { IndexRing } from "@/components/route/IndexPill";
import { Disclaimer, SourceBadge } from "@/components/route/Disclaimer";
import { currentPosition, SAMPLE_ORIGIN } from "@/lib/geocode";
import { ApiError, getDemoOnly, saferouteApi, type LatLng, type NearbyResponse } from "@/lib/saferouteApi";
import { demoNearby } from "@/lib/demoAnalysis";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/safety-map")({
  head: () => ({
    meta: [
      { title: "Around Me — SafeRoute" },
      { name: "description", content: "See which places near you are open right now." },
      { property: "og:title", content: "Around Me — SafeRoute" },
      { property: "og:description", content: "Open places near your location." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SafetyMapPage,
});

function SafetyMapPage() {
  const [center, setCenter] = useState<LatLng | undefined>();
  const [data, setData] = useState<NearbyResponse | null>(null);
  const [source, setSource] = useState<"live" | "demo">("live");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "open">("all");

  async function scan(useSample = false) {
    setLoading(true);
    try {
      const p = useSample ? SAMPLE_ORIGIN : await currentPosition();
      setCenter(p);
      if (getDemoOnly()) {
        setSource("demo");
        setData(demoNearby(p));
      } else {
        try {
          setData(await saferouteApi.nearby(p));
          setSource("live");
        } catch (e) {
          if (e instanceof ApiError && e.unreachable) {
            setSource("demo");
            setData(demoNearby(p));
            toast.warning("Couldn't reach the SafeRoute engine — showing sample places.");
          } else throw e;
        }
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't load places");
    } finally {
      setLoading(false);
    }
  }

  const places = (data?.places ?? []).filter((p) => filter === "all" || p.openNow === true);

  return (
    <AppLayout title="Around Me" fullBleed>
      <MiniHero className="m-4 mb-0 lg:hidden" title="Around Me" description="Find out how many places close to you are open right now." />
      <div className="flex flex-col pt-4 lg:h-[calc(100vh-4rem)] lg:flex-row lg:pt-0">
        <aside className="order-2 w-full space-y-4 border-r border-border bg-card p-5 lg:order-1 lg:w-[380px] lg:overflow-y-auto">
          <MiniHero className="hidden lg:block" title="Around Me" description="Find out how many places close to you are open right now." />
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => scan()} disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Crosshair className="size-4" />} Scan my area
            </Button>
            <Button variant="outline" onClick={() => scan(true)} disabled={loading}>Sample</Button>
          </div>
          {data && (
            <>
              <div className="flex items-center gap-4 rounded-2xl border border-border p-4">
                <IndexRing value={data.safetyIndex} />
                <div className="flex-1">
                  <p className="font-semibold">{data.openPlaceCount} of {data.scoredPlaceCount} open</p>
                  <p className="text-xs text-muted-foreground">{data.places.length} places found nearby</p>
                </div>
                <SourceBadge source={source} />
              </div>
              <div className="flex gap-1.5">
                {(["all", "open"] as const).map((f) => (
                  <button key={f} type="button" onClick={() => setFilter(f)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                    {f === "all" ? "All places" : "Open now"}
                  </button>
                ))}
              </div>
              <ul className="space-y-2">
                {places.map((p, i) => (
                  <li key={p.id ?? i} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-secondary"><Store className="size-4 text-muted-foreground" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="truncate text-xs capitalize text-muted-foreground">{(p.types?.[0] ?? "place").replace(/_/g, " ")}</p>
                    </div>
                    <span className={cn("text-xs font-medium", p.openNow === true ? "text-safe" : p.openNow === false ? "text-risk" : "text-muted-foreground")}>
                      {p.openNow === true ? "Open" : p.openNow === false ? "Closed" : "Unknown"}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <Disclaimer />
        </aside>
        <section className="relative order-1 h-[45vh] min-h-[300px] flex-none sm:h-[50vh] lg:flex-1 lg:order-2 lg:h-auto">
          <RouteMap center={center} places={places} />
        </section>
      </div>
    </AppLayout>
  );
}
