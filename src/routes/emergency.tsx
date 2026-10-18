import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, PhoneCall, Plus, Share2, Siren, Timer, Trash2, UserRound } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInPrompt } from "@/components/auth/SignInPrompt";
import { useSession } from "@/lib/session";
import { useAddContact, useContacts, useRemoveContact } from "@/lib/contacts";
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
            <Button variant="outline" size="lg" asChild><Link to="/fake-call"><PhoneCall className="size-4" /> Fake call</Link></Button>
            <CheckInTimer />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Your trusted contacts are saved on this device too, so this page still shows them without internet.</p>
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
          <TrustedContacts />
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><Siren className="size-3.5" /> In immediate danger, always call your local emergency number.</p>
        </div>
      </div>
    </AppLayout>
  );
}

function CheckInTimer() {
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);

  useEffect(() => {
    if (minutesLeft == null) return;
    if (minutesLeft === 0) {
      toast.error("Check-in missed — share your location with a trusted contact now.", { duration: 15000 });
      setMinutesLeft(null);
      return;
    }
    const t = setTimeout(() => setMinutesLeft(minutesLeft - 1), 60_000);
    return () => clearTimeout(t);
  }, [minutesLeft]);

  if (minutesLeft == null) {
    return (
      <Button variant="outline" size="lg" onClick={() => setMinutesLeft(20)}>
        <Timer className="size-4" /> Check-in 20 min
      </Button>
    );
  }
  return (
    <Button variant="outline" size="lg" className="border-moderate text-moderate" onClick={() => { setMinutesLeft(null); toast.success("Checked in — timer cancelled"); }}>
      <Timer className="size-4" /> {minutesLeft} min left — tap to check in
    </Button>
  );
}

function TrustedContacts() {
  const session = useSession();
  const uid = session.user?.id;
  const { data: contacts = [], isLoading } = useContacts(uid);
  const add = useAddContact(uid);
  const remove = useRemoveContact(uid);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display font-semibold">Trusted contacts</h2>
      {!session.ready ? null : !uid ? (
        <div className="mt-3"><SignInPrompt text="Log in to keep your own trusted contacts here, ready to call in one tap." /></div>
      ) : (
        <>
          {isLoading ? (
            <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
          ) : contacts.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No contacts yet — add someone you trust below.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {contacts.map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <span className="grid size-9 place-items-center rounded-full bg-secondary"><UserRound className="size-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{[c.relation, c.phone].filter(Boolean).join(" · ")}</p>
                  </div>
                  <Button asChild size="icon" variant="outline" aria-label={`Call ${c.name}`}><a href={`tel:${c.phone}`}><Phone className="size-4" /></a></Button>
                  <Button size="icon" variant="ghost" aria-label={`Remove ${c.name}`} onClick={() => remove.mutate(c.id)}><Trash2 className="size-4" /></Button>
                </li>
              ))}
            </ul>
          )}
          <form
            className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
            onSubmit={(e) => {
              e.preventDefault();
              const n = name.trim(), p = phone.trim();
              if (!n || !/^[+\d][\d\s-]{2,19}$/.test(p)) { toast.error("Enter a name and a valid phone number"); return; }
              add.mutate(
                { name: n.slice(0, 80), phone: p, relation: relation.trim().slice(0, 40) },
                {
                  onSuccess: () => { setName(""); setPhone(""); setRelation(""); toast.success("Contact added"); },
                  onError: (err) => toast.error(err.message),
                },
              );
            }}
          >
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Contact name" />
            <Input placeholder="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="Contact phone" />
            <Input className="sm:col-span-2" placeholder="Relation (optional)" value={relation} onChange={(e) => setRelation(e.target.value)} aria-label="Relation" />
            <Button type="submit" disabled={add.isPending} className="sm:row-start-1 sm:col-start-3"><Plus className="size-4" /> Add</Button>
          </form>
        </>
      )}
    </div>
  );
}
