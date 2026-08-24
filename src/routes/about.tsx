import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, HeartHandshake, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { PublicLayout, PageHeader } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { DISCLAIMER } from "@/data/mockData";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SafeRoute — Why Safety-Scored Navigation Exists" },
      {
        name: "description",
        content:
          "SafeRoute is built on the belief that reaching a destination and reaching it safely are two different problems. Learn about our mission and principles.",
      },
      { property: "og:title", content: "About SafeRoute" },
      {
        property: "og:description",
        content:
          "Our mission, our principles, and our commitment to privacy-respecting, non-alarmist safety guidance.",
      },
    ],
  }),
  component: AboutPage,
});

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Informative, never alarming",
    body: "We describe conditions and trade-offs. We don't use fear as a design pattern, and we never label neighbourhoods or people as dangerous.",
  },
  {
    icon: Lock,
    title: "Privacy by default",
    body: "Location data exists to help you plan a journey. Sharing is opt-in, time-bound and always visible to you while it's active.",
  },
  {
    icon: HeartHandshake,
    title: "Your judgement leads",
    body: "SafeRoute presents information and reasoning. The choice of route always belongs to the person taking it.",
  },
  {
    icon: Sparkles,
    title: "Explainable scoring",
    body: "Every score comes with the factors behind it. If we can't explain a recommendation, we don't make it.",
  },
];

function AboutPage() {
  return (
    <PublicLayout>
      <PageHeader
        eyebrow="About"
        title="Reaching your destination and reaching it safely are two different problems"
        description="Navigation apps solved the first one decades ago. SafeRoute exists for the second — for the journeys where the shortest line on a map isn't the one you'd choose."
      />

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">Our mission</h2>
          <p className="mt-4 text-muted-foreground">
            Millions of everyday journeys — a late shift, a walk home from the station, a commute
            that runs past sunset — involve a quiet calculation that navigation software has never
            helped with. SafeRoute makes that calculation explicit, comparable and transparent.
          </p>
          <p className="mt-4 text-muted-foreground">
            We are frontend-first and integration-ready by design: the interface, scoring model and
            comparison experience are built now, with a services layer prepared for real mapping and
            safety data sources.
          </p>
          <Button asChild className="mt-8">
            <Link to="/how-it-works">
              See how it works
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <Compass className="mx-auto size-8 text-primary" aria-hidden="true" />
          <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">Navigate safer. Travel smarter.</h2>
          <p className="mt-4 text-muted-foreground">{DISCLAIMER}</p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/route-planner">Plan a Safe Route</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
