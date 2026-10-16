import { CircleHelp, HeartPulse, Lightbulb, ShieldCheck, Store } from "lucide-react";
import type { ApiRoute } from "@/lib/saferouteApi";
import { formatDistance } from "@/lib/saferouteApi";

export function RouteAssessmentPanel({ route, sample = false }: { route: ApiRoute; sample?: boolean }) {
  const a = route.assessment;
  return <section aria-label="Route factors" className="border-y border-border py-5">
    <h2 className="font-display font-semibold">More than open shops</h2>
    <p className="mt-2 text-sm text-muted-foreground">{sample ? "Example assessment — not current conditions." : "Experimental comparison using the information found, not a guarantee of safety."}</p>
    <dl className="mt-4 space-y-4 text-sm">
      <Factor icon={Store} title="Open places nearby" value={a?.activity == null ? "Not available" : `${Math.round(a.activity)} / 100`} detail="Based on how many open places were found near the route, not just the percentage open. This does not measure crowds." />
      <Factor icon={HeartPulse} title="Places to seek help" value={a?.helpPlaces.length ? `${a.helpPlaces.length} found open` : "Not confirmed"} detail="Police, fire stations, hospitals and pharmacies returned by the search. Being nearby does not guarantee access or assistance." />
      <Factor icon={CircleHelp} title="How much we could check" value={a ? `${Math.round(a.coverage)}% of journey` : "Plan again to check"} detail="Opening hours near the route. Below 50% coverage, no overall comparison score is shown." />
      <Factor icon={Lightbulb} title="Street lighting" value="Not available" detail="We do not have verified street-level lighting information for this journey. Open shops are not a substitute." />
      <Factor icon={ShieldCheck} title="Reported crime" value="Not available" detail="No trusted street-level crime source is connected for this journey. Missing information never means no crime." />
    </dl>
    {!!a?.helpPlaces.length && <div className="mt-5 border-t border-border pt-4"><h3 className="text-sm font-semibold">Help locations found</h3><ul className="mt-2 space-y-2 text-sm">{a.helpPlaces.slice(0, 5).map(p => <li key={p.id ?? `${p.name}:${p.latitude}`}><a className="text-primary underline underline-offset-4" href={`https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}${p.id ? `&query_place_id=${encodeURIComponent(p.id)}` : ""}`} target="_blank" rel="noopener noreferrer">{p.name}</a><span className="ml-2 text-xs text-muted-foreground">Reported open</span></li>)}</ul>{a.nearestHelpMeters != null && <p className="mt-2 text-xs text-muted-foreground">Closest observed help: about {formatDistance(a.nearestHelpMeters)} in a straight line from a checked point; walking access may differ.</p>}</div>}
    <details className="mt-4 text-xs text-muted-foreground"><summary className="cursor-pointer font-medium">How the comparison works</summary><p className="mt-2">Open-place density contributes 70% and observed nearby help contributes 30% when help is found. If help is unknown, only activity is used and that limitation is shown. Five observed open places within 250 metres reaches the activity maximum. Lighting and crime are excluded until verified sources are connected. These experimental weights have not been validated against safety outcomes.</p></details>
  </section>;
}

function Factor({ icon: Icon, title, value, detail }: { icon: typeof Store; title: string; value: string; detail: string }) {
  return <div><dt className="flex flex-wrap items-center justify-between gap-2"><span className="flex items-center gap-2 font-medium"><Icon className="size-4 shrink-0 text-primary" />{title}</span><span className="text-xs text-muted-foreground">{value}</span></dt><dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</dd></div>;
}