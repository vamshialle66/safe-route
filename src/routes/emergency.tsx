import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Share2, Siren, UserRound } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { EMERGENCY_CONTACTS } from "@/data/mockData";
import { currentPosition } from "@/lib/geocode";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency — SafeRoute" },
      { name: "description", content: "One-tap SOS, emergency numbers, location sharing and trusted contacts." },
      { property: "og:title", content: "Emergency — SafeRoute" },
      { property: "og:description", content: "Emergency tools when you need them." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EmergencyPage,
});

const HELPLINES = [
  { label: "Emergency", number: "112" },
  { label: "Women's Helpline", number: "1091" },
  { label: "Police", number: "100" },
  { label: "Ambulance", number: "108" },
];

function EmergencyPage() {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown == null) return;
    if (countdown === 0) {
      window.location.href = "tel:112";
      setCountdown(null);
      return;
    }
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function share() {
    try {
      const p = await currentPosition();
      const url = `https://maps.google.com/?q=${p.latitude},${p.longitude}`;
      if (navigator.share) await navigator.share({ title: "My location", text: "I'm sharing my live location", url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Location link copied");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't share location");
    }
  }

  return (
    <AppLayout title="Emergency" description="Help is one tap away. Calls use your phone's dialler.">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col items-center rounded-3xl border border-border bg-card p-8 text-center">
          <button
            type="button"
            onClick={() => setCountdown(countdown == null ? 3 : null)}
            className={cn(
              "relative grid size-52 place-items-center rounded-full bg-risk font-display text-4xl font-bold text-risk-foreground shadow-lift transition-transform active:scale-95",
              countdown != null && "animate-pulse",
            )}
            aria-label={countdown == null ? "Start SOS call to 112" : "Cancel SOS"}
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-risk/30" aria-hidden="true" />
            <span className="relative">{countdown == null ? "SOS" : countdown}</span>
          </button>
          <p className="mt-6 text-sm text-muted-foreground">
            {countdown == null ? "Tap to call 112 after a 3-second countdown." : "Calling 112… tap again to cancel."}
          </p>
          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={share}><Share2 className="size-4" /> Share location</Button>
            <Button variant="outline" size="lg" asChild><a href="/safety-map"><MapPin className="size-4" /> Open places</a></Button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold">Helplines (India)</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {HELPLINES.map((h) => (
                <a key={h.number} href={`tel:${h.number}`} className="rounded-xl border border-border p-4 transition-colors hover:bg-accent">
                  <p className="font-display text-2xl font-semibold">{h.number}</p>
                  <p className="text-xs text-muted-foreground">{h.label}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold">Trusted contacts</h2>
            <ul className="mt-3 divide-y divide-border">
              {EMERGENCY_CONTACTS.map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <span className="grid size-9 place-items-center rounded-full bg-secondary"><UserRound className="size-4" /></span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.relation}</p>
                  </div>
                  <Button asChild size="icon" variant="outline" aria-label={`Call ${c.name}`}><a href={`tel:${c.phone}`}><Phone className="size-4" /></a></Button>
                </li>
              ))}
            </ul>
          </div>
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><Siren className="size-3.5" /> In immediate danger, always call your local emergency number.</p>
        </div>
      </div>
    </AppLayout>
  );
}
