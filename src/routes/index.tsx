import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Compass,
  Gauge,
  Lightbulb,
  MapPinned,
  Route as RouteIcon,
  ScanSearch,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/map/MapView";
import { RouteCard } from "@/components/route/RouteCard";
import { SafetyScore } from "@/components/safety/SafetyScore";
import { SafetyBreakdown } from "@/components/safety/SafetyBreakdown";
import { MOCK_ROUTES } from "@/data/mockRoutes";
import { DISCLAIMER, SAFETY_FACTOR_INFO } from "@/data/mockData";
import { SAFE_PLACES } from "@/data/mockData";
import { safetyService } from "@/services/safetyService";
import { formatKm, formatMin } from "@/lib/risk";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeRoute — Women's Safety-Scored Route Navigator" },
      {
        name: "description",
        content:
          "SafeRoute compares routes using safety, distance and travel time so you can make more informed travel decisions.",
      },
      { property: "og:title", content: "SafeRoute — Navigate safer. Travel smarter." },
      {
        property: "og:description",
        content:
          "Compare alternative routes with a clear safety score built from lighting, public activity, risk levels and nearby safe locations.",
      },
    ],
  }),
  component: LandingPage,
});

const STEPS = [
  { icon: MapPinned, title: "Enter your destination", body: "Set your start point and where you're heading." },
  { icon: RouteIcon, title: "Generate available routes", body: "SafeRoute builds the realistic route alternatives." },
  { icon: ScanSearch, title: "Analyze safety factors", body: "Each segment is assessed against safety signals." },
  { icon: ShieldCheck, title: "Compare and choose", body: "See the trade-offs and pick your journey." },
];

const FACTOR_ICONS = [Lightbulb, ShieldCheck, Users, RouteIcon, MapPinned, Gauge];

function LandingPage() {
  const safest = MOCK_ROUTES[0];

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-primary/8 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
              Safety-scored navigation
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
              <span className="text-gradient-brand">Your destination matters.</span>
              <br />
              So does how you get there.
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              SafeRoute helps you compare routes using safety, distance and travel time — so you can
              make more informed travel decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/route-planner">
                  Plan a Safe Route
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                ["3", "Route alternatives"],
                ["5", "Safety factors"],
                ["100", "Point score scale"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <dt className="font-display text-2xl font-semibold">{value}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <MapView
              routes={MOCK_ROUTES}
              activeRouteId="safest"
              safePlaces={SAFE_PLACES}
              destinationLabel="14 Elmgrove Terrace"
              className="h-[420px] w-full shadow-lift sm:h-[500px]"
              showControls={false}
              interactive={false}
            />
            <div className="mt-4 grid gap-4 sm:absolute sm:-bottom-10 sm:-left-6 sm:mt-0 sm:w-[19rem]">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-lift">
                <div className="flex items-center gap-4">
                  <SafetyScore score={safest.safetyScore} label="Excellent" size="sm" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Overall Route Safety
                    </p>
                    <p className="mt-1 font-display text-base font-semibold">{safest.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatKm(safest.distanceKm)} · {formatMin(safest.durationMin)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY SCORE CARD + BREAKDOWN */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-background p-8 shadow-soft sm:flex-row sm:items-center sm:gap-10">
            <SafetyScore score={92} label="Excellent" size="lg" caption="Overall Route Safety" />
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl font-semibold">Overall Route Safety</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                One number that summarises how a route performs across every safety factor we can
                evaluate — so comparisons take seconds, not guesswork.
              </p>
              <SafetyBreakdown factors={safest.factors} className="mt-5" compact />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              A score you can actually reason about
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every route is broken down into segments and evaluated against lighting, public
              activity, comparative risk level, road conditions and proximity to safe locations.
              When a route is recommended, SafeRoute tells you exactly why.
            </p>
            <ul className="mt-6 space-y-3">
              {safest.reasons.map((reason) => (
                <li key={reason} className="flex gap-3 text-sm">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-safe" aria-hidden="true" />
                  <span className="text-muted-foreground">{reason}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl border border-border bg-secondary p-4 text-xs text-muted-foreground">
              {DISCLAIMER}
            </p>
          </div>
        </div>
      </section>

      {/* ROUTE PREVIEW */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">Compare, then commit</h2>
            <p className="mt-3 text-muted-foreground">
              The fastest route isn't automatically the best route. SafeRoute puts safety first in
              the hierarchy, with distance and time alongside it.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {MOCK_ROUTES.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            {safetyService.recommendationReason(MOCK_ROUTES[0])}
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="text-2xl font-semibold sm:text-3xl">How it works</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="rounded-2xl border border-border bg-background p-6 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* SAFETY FACTORS */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="text-2xl font-semibold sm:text-3xl">Safety factors we evaluate</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SAFETY_FACTOR_INFO.map((factor, i) => {
              const Icon = FACTOR_ICONS[i % FACTOR_ICONS.length];
              return (
                <div
                  key={factor.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold">{factor.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{factor.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY SAFEROUTE */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="rounded-2xl border border-border bg-background p-8 shadow-soft">
            <h2 className="font-display text-xl font-semibold">Traditional navigation optimises</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                ["Distance", RouteIcon],
                ["Travel time", Clock],
                ["Traffic conditions", Gauge],
              ].map(([label, Icon]) => {
                const I = Icon as typeof Clock;
                return (
                  <li key={label as string} className="flex items-center gap-3">
                    <I className="size-4" aria-hidden="true" />
                    {label as string}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary-soft/60 p-8 shadow-soft">
            <h2 className="font-display text-xl font-semibold">SafeRoute adds</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {["Safety scoring per route", "Route risk comparison", "Safer route visualization"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3">
                    <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ),
              )}
            </ul>
            <Button asChild className="mt-7" variant="outline">
              <Link to="/safety">See the methodology</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center shadow-lift sm:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold text-primary-foreground sm:text-4xl">
              Ready to travel with more confidence?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Navigate safer. Travel smarter.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8">
              <Link to="/route-planner">
                <Compass className="size-4" aria-hidden="true" />
                Plan a Safe Route
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
