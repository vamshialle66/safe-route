import { createFileRoute } from "@tanstack/react-router";
import { Info, ShieldCheck } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PublicLayout, PageHeader } from "@/components/layout/PublicLayout";
import { SafetyScore } from "@/components/safety/SafetyScore";
import { SafetyBreakdown } from "@/components/safety/SafetyBreakdown";
import { MOCK_ROUTES } from "@/data/mockRoutes";
import { DISCLAIMER, SAFETY_FACTOR_INFO } from "@/data/mockData";
import { safetyService } from "@/services/safetyService";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety & Methodology — How the SafeRoute Score Works" },
      {
        name: "description",
        content:
          "How SafeRoute builds a comparative 0–100 safety score from lighting, public activity, risk level, road conditions and nearby safe locations.",
      },
      { property: "og:title", content: "SafeRoute Safety & Methodology" },
      {
        property: "og:description",
        content:
          "A transparent look at the factors, weights and limitations behind the SafeRoute safety score.",
      },
    ],
  }),
  component: SafetyPage,
});

function SafetyPage() {
  const safest = MOCK_ROUTES[0];
  const weights = safetyService.factorWeights();
  const chartData = weights.map((w) => ({
    name: w.label,
    weight: w.weight,
    value: safest.factors[w.key],
  }));

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Safety & methodology"
        title="What the safety score means — and what it doesn't"
        description="The score is a comparative indication between the routes available to you right now. It is not a prediction, and it is not a claim about any individual place."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div
          className="flex items-start gap-3 rounded-2xl border border-moderate/40 bg-moderate-soft p-5 text-sm text-moderate-foreground"
          role="note"
        >
          <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p>
            <strong className="font-semibold">Sample data notice.</strong> {DISCLAIMER} None of the
            figures on this page are real crime statistics.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[auto_1fr]">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <SafetyScore score={92} label="Excellent" size="lg" caption="Sample route safety score" />
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <h2 className="font-display text-lg font-semibold">Breakdown (sample values)</h2>
            <SafetyBreakdown factors={safest.factors} className="mt-6" />
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <h2 className="font-display text-lg font-semibold">How each factor contributes</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Factors are weighted, then combined into a single 0–100 score. Comparative risk and
            public activity carry the most influence.
          </p>
          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <ReTooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                  formatter={(value: number, key) =>
                    key === "weight" ? [`${value}% weight`, "Weight"] : [`${value}%`, "Sample value"]
                  }
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} name="value">
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill="var(--color-chart-1)" />
                  ))}
                </Bar>
                <Bar dataKey="weight" radius={[6, 6, 0, 0]} name="weight" fill="var(--color-chart-5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {weights.map((w) => (
              <li key={w.key} className="flex items-center justify-between rounded-xl bg-secondary px-4 py-2.5">
                <span>{w.label}</span>
                <span className="font-medium text-foreground">{w.weight}% weight</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SAFETY_FACTOR_INFO.map((factor) => (
            <div key={factor.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{factor.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{factor.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-secondary p-6 text-sm text-muted-foreground">
          <h2 className="font-display text-base font-semibold text-foreground">Limitations</h2>
          <ul className="mt-3 space-y-2">
            <li>Scores compare the routes generated for one journey — not cities or neighbourhoods.</li>
            <li>Conditions change with time of day, weather and local events.</li>
            <li>A high score is not a guarantee of safety, and a low score is not an accusation.</li>
            <li>Always use your own judgement and local knowledge.</li>
          </ul>
        </div>
      </section>
    </PublicLayout>
  );
}
