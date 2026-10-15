import { RouteMap } from "@/components/map/RouteMap";
import { IndexRing } from "@/components/route/IndexPill";
import { demoSegments } from "@/lib/demoAnalysis";
import { SAMPLE_DESTINATION, SAMPLE_ORIGIN } from "@/lib/geocode";
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
import { RouteCard } from "@/components/route/RouteCard";
import { SafetyScore } from "@/components/safety/SafetyScore";
import { SafetyBreakdown } from "@/components/safety/SafetyBreakdown";
import { MOCK_ROUTES } from "@/data/mockRoutes";
import { DISCLAIMER, SAFETY_FACTOR_INFO } from "@/data/mockData";
import { safetyService } from "@/services/safetyService";

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

const HERO = demoSegments(SAMPLE_ORIGIN, SAMPLE_DESTINATION, "WALK");

function LandingPage() {
  const safest = MOCK_ROUTES[0]!;

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero text-sidebar-accent-foreground">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-8 lg:py-24">
          <div className="animate-fade-up">
            <span className="glass-dark inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-safe opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-safe" />
              </span>
              Scoring every 100 m of your journey
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Take the
              <span className="relative mx-3 inline-block text-sidebar-primary">
                livelier
                <svg viewBox="0 0 200 12" className="absolute -bottom-2 left-0 w-full" aria-hidden="true"><path d="M2 9 Q 100 -2 198 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
              way home.
            </h1>
            <p className="mt-6 max-w-xl text-base text-sidebar-foreground/80 sm:text-lg">
              SafeRoute compares every route to your destination and shows, stretch by stretch, how many shops, cafés and services along the way are open right now.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                <Link to="/route-planner">
                  Plan a route
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="glass-dark text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <Link to="/how-it-works">How it works</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {[
                ["5", "Routes compared"],
                ["100 m", "Stretch size"],
                ["20 m", "Search band"],
              ].map(([value, label]) => (
                <div key={label} className="glass-dark rounded-2xl p-4">
                  <dt className="font-display text-2xl font-semibold">{value}</dt>
                  <dd className="mt-1 text-xs text-sidebar-foreground/70">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-sidebar-primary/20 blur-3xl" aria-hidden="true" />
            <div className="relative h-[440px] overflow-hidden rounded-3xl border border-sidebar-border shadow-lift sm:h-[520px]">
              <RouteMap routes={HERO.routes} selectedRoute={2} origin={SAMPLE_ORIGIN} destination={SAMPLE_DESTINATION} showPlaces={false} />
            </div>
            <div className="glass absolute -bottom-6 left-4 z-[500] w-[17rem] animate-float rounded-2xl p-4 text-card-foreground sm:-left-8">
              <div className="flex items-center gap-3">
                <IndexRing value={HERO.routes[1]?.safetyIndex} size={64} />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Liveliest route</p>
                  <p className="font-display font-semibold">Kurla → Dadar</p>
                  <p className="text-xs text-muted-foreground">Most places open along the way</p>
                </div>
              </div>
            </div>
            <div className="glass absolute -top-4 right-4 z-[500] hidden rounded-2xl px-4 py-3 text-card-foreground sm:block" style={{ animationDelay: "1.5s" }}>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Quiet stretch ahead</p>
              <p className="flex items-center gap-2 text-sm font-semibold"><span className="size-2 rounded-full bg-risk" /> 2 of 9 places open</p>
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
            {safetyService.recommendationReason(MOCK_ROUTES[0]!)}
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
              const Icon = FACTOR_ICONS[i % FACTOR_ICONS.length]!;
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
