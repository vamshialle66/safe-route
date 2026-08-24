import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Flag,
  Gauge,
  MapPin,
  Route as RouteIcon,
  ScanSearch,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { PublicLayout, PageHeader } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/map/MapView";
import { MOCK_ROUTES } from "@/data/mockRoutes";
import { DISCLAIMER } from "@/data/mockData";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How SafeRoute Works — Safety-Scored Route Planning" },
      {
        name: "description",
        content:
          "From source and destination to safety analysis and route comparison: the seven steps SafeRoute takes before you choose a journey.",
      },
      { property: "og:title", content: "How SafeRoute Works" },
      {
        property: "og:description",
        content:
          "See the full flow: generate routes, analyze safety factors, calculate a score, compare and choose.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const FLOW = [
  { icon: MapPin, title: "Select source", body: "Use your current location or type a starting point. Saved places make this one tap." },
  { icon: Flag, title: "Select destination", body: "Enter where you're heading. Recent and saved destinations appear as suggestions." },
  { icon: RouteIcon, title: "Generate available routes", body: "SafeRoute builds realistic alternatives instead of a single 'best' answer." },
  { icon: ScanSearch, title: "Analyze safety factors", body: "Each route is split into segments and evaluated against every available safety signal." },
  { icon: Gauge, title: "Calculate safety score", body: "Factor values are weighted into a single 0–100 comparative score per route." },
  { icon: Scale, title: "Compare routes", body: "Safety, distance, ETA, lighting, public activity and risk segments side by side." },
  { icon: CheckCircle2, title: "Choose the preferred route", body: "Pick the journey that fits your comfort level — not just the quickest line." },
];

function HowItWorksPage() {
  return (
    <PublicLayout>
      <PageHeader
        eyebrow="How it works"
        title="Seven steps between you and a more informed journey"
        description="SafeRoute considers safety-related factors alongside travel convenience, then makes the trade-offs visible so the decision stays yours."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <ol className="relative space-y-6 before:absolute before:left-[1.4rem] before:top-3 before:bottom-3 before:w-px before:bg-border md:before:left-1/2">
          {FLOW.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative md:grid md:grid-cols-2 md:gap-10">
                <div
                  className={
                    i % 2 === 0
                      ? "md:col-start-1 md:text-right md:pr-12"
                      : "md:col-start-2 md:pl-12"
                  }
                >
                  <div className="ml-14 rounded-2xl border border-border bg-card p-6 shadow-soft md:ml-0">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Step {i + 1}
                    </span>
                    <h2 className="mt-2 font-display text-lg font-semibold">{step.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </div>
                <span
                  className="absolute left-0 top-6 grid size-11 place-items-center rounded-xl border border-border bg-background text-primary shadow-soft md:left-1/2 md:-translate-x-1/2"
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Safety alongside convenience</h2>
            <p className="mt-4 text-muted-foreground">
              Distance and travel time still matter — they're shown on every route card. The
              difference is that safety is the primary differentiator, presented first and largest,
              with an explanation of what drove the score.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                "Segment-level analysis rather than a single route-wide guess",
                "Explicit reasons for every recommendation",
                "Never implies the fastest route is automatically the best route",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-safe" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8">
              <Link to="/route-planner">
                Try the route planner
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <MapView
            routes={MOCK_ROUTES}
            activeRouteId="safest"
            className="h-[380px] w-full shadow-lift"
            showControls={false}
            interactive={false}
            destinationLabel="14 Elmgrove Terrace"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-secondary p-6 text-sm text-muted-foreground">
          <p className="mb-2 inline-flex items-center gap-2 font-medium text-foreground">
            <Compass className="size-4" aria-hidden="true" />
            About the data
          </p>
          {DISCLAIMER}
        </div>
      </section>
    </PublicLayout>
  );
}
