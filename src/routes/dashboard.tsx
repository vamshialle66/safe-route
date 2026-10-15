import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bookmark, Compass, History, LifeBuoy, Map, Server } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import { IndexPill } from "@/components/route/IndexPill";
import { SourceBadge } from "@/components/route/Disclaimer";
import { RouteMap } from "@/components/map/RouteMap";
import { useCurrentAnalysis, useHistory, useSaved, analysisStore } from "@/lib/analysisStore";
import { formatDistance, topRouteNumbers } from "@/lib/saferouteApi";
import { MOCK_USER } from "@/data/mockData";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SafeRoute" },
      { name: "description", content: "Your latest route analysis, recent trips, saved routes and quick actions." },
      { property: "og:title", content: "Dashboard — SafeRoute" },
      { property: "og:description", content: "Your SafeRoute overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const current = useCurrentAnalysis();
  const history = useHistory();
  const saved = useSaved();
  const best = current ? current.routes.find((r) => topRouteNumbers(current.routes).has(r.routeNumber)) ?? current.routes[0] : undefined;
  const avg = history.flatMap((h) => h.routes.map((r) => r.safetyIndex).filter((v): v is number => v != null));
  const hour = new Date().getHours();

  return (
    <AppLayout
      title={`Good ${hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"}, ${MOCK_USER.name.split(" ")[0]}`}
      description="Plan a trip, check the latest analysis, or jump to emergency tools."
      actions={<Button asChild size="lg"><Link to="/route-planner"><Compass className="size-4" /> Plan a route</Link></Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Trips analysed" value={String(history.length)} hint="On this device" icon={History} />
        <StatCard label="Routes compared" value={String(history.reduce((a, h) => a + h.routes.length, 0))} hint="Across all trips" icon={Map} />
        <StatCard label="Average index" value={avg.length ? (avg.reduce((a, b) => a + b, 0) / avg.length).toFixed(0) : "—"} hint="Of routes with data" icon={Compass} />
        <StatCard label="Saved routes" value={String(saved.length)} hint="Ready to reuse" icon={Bookmark} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display font-semibold">Latest analysis</h2>
              {current && <p className="text-xs text-muted-foreground">{current.origin.label.split(",")[0]} → {current.destination.label.split(",")[0]}</p>}
            </div>
            {current && <SourceBadge source={current.source} />}
          </div>
          {current && best ? (
            <>
              <div className="h-72"><RouteMap routes={current.routes} selectedRoute={best.routeNumber} origin={current.origin} destination={current.destination} showPlaces={false} /></div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium">Route {best.routeNumber}</span>
                  <IndexPill value={best.safetyIndex} />
                  <span className="text-muted-foreground">{formatDistance(best.distanceMeters)}</span>
                </div>
                <Button asChild variant="outline" size="sm"><Link to="/routes">Compare all <ArrowRight className="size-3.5" /></Link></Button>
              </div>
            </>
          ) : (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No trips yet. <Link to="/route-planner" className="text-primary hover:underline">Plan your first route</Link>.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Link to="/emergency" className="flex items-center gap-4 rounded-2xl bg-risk p-5 text-risk-foreground shadow-lift transition-transform hover:-translate-y-0.5">
            <LifeBuoy className="size-8" />
            <div>
              <p className="font-display text-lg font-semibold">Emergency</p>
              <p className="text-sm opacity-90">SOS, share location, call contacts</p>
            </div>
          </Link>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold">Recent trips</h2>
            <ul className="mt-3 space-y-2">
              {history.slice(0, 4).map((h) => (
                <li key={h.id}>
                  <Link to="/routes" onClick={() => analysisStore.open(h.id)} className="flex items-center justify-between rounded-xl px-2 py-2 text-sm hover:bg-accent">
                    <span className="truncate">{h.origin.label.split(",")[0]} → {h.destination.label.split(",")[0]}</span>
                    <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
              {!history.length && <li className="text-sm text-muted-foreground">Your trips will show here.</li>}
            </ul>
          </div>
          <Link to="/settings" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm hover:bg-accent">
            <Server className="size-4 text-muted-foreground" /> Route engine connection
            <ArrowRight className="ml-auto size-3.5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
