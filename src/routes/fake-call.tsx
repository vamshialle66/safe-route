import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mic, Phone, PhoneOff, Video, Volume2 } from "lucide-react";
import { displayName, useSession } from "@/lib/session";

export const Route = createFileRoute("/fake-call")({
  head: () => ({
    meta: [
      { title: "Incoming call — SafeRoute" },
      { name: "description", content: "A realistic incoming call screen to help you leave an uncomfortable situation." },
      { property: "og:title", content: "Incoming call — SafeRoute" },
      { property: "og:description", content: "A realistic incoming call screen to help you leave an uncomfortable situation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FakeCallPage,
});

const CALLER_NAMES = ["Mum", "Dad", "Home", "Roommate", "Office"];

function FakeCallPage() {
  const navigate = useNavigate();
  const session = useSession();
  const [caller, setCaller] = useState("Mum");
  const [started, setStarted] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!answered) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [answered]);

  useEffect(() => {
    if (!started || answered) return;
    try { navigator.vibrate?.([400, 200, 400, 200, 400]); } catch { /* vibration unsupported */ }
  }, [started, answered]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  if (!started) {
    return (
      <div className="grid min-h-screen place-items-center bg-hero p-6 text-sidebar-accent-foreground">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="font-display text-2xl font-semibold">Fake call</h1>
          <p className="text-sm text-sidebar-foreground/80">
            Shows a realistic incoming call so you can step away from an uncomfortable situation. Pick who should "call" you.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {CALLER_NAMES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCaller(n)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${caller === n ? "bg-safe text-safe-foreground" : "glass-dark"}`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="w-full rounded-2xl bg-safe py-4 font-display text-lg font-semibold text-safe-foreground shadow-lift"
          >
            Ring my phone now
          </button>
          <button type="button" onClick={() => void navigate({ to: "/emergency" })} className="text-sm text-sidebar-foreground/70 underline">
            Back to Emergency
          </button>
          <p className="text-xs text-sidebar-foreground/50">Signed in as {displayName(session)} — nothing here is recorded or sent.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-hero p-8 py-16 text-sidebar-accent-foreground">
      <div className="mt-10 text-center">
        <p className="text-sm text-sidebar-foreground/70">{answered ? `${mm}:${ss}` : "Incoming call…"}</p>
        <div className="mx-auto mt-6 grid size-28 place-items-center rounded-full bg-primary font-display text-4xl font-bold text-primary-foreground shadow-lift">
          {caller[0]}
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold">{caller}</h1>
        <p className="mt-1 text-sm text-sidebar-foreground/70">mobile</p>
      </div>
      {!answered && (
        <div className="flex gap-6 text-xs text-sidebar-foreground/70">
          <span className="flex flex-col items-center gap-1"><Volume2 className="size-6" />Speaker</span>
          <span className="flex flex-col items-center gap-1"><Video className="size-6" />Video</span>
          <span className="flex flex-col items-center gap-1"><Mic className="size-6" />Mute</span>
        </div>
      )}
      <div className="flex items-center gap-16">
        <button
          type="button"
          aria-label="Decline call"
          onClick={() => void navigate({ to: "/emergency" })}
          className="grid size-16 place-items-center rounded-full bg-risk text-risk-foreground shadow-lift"
        >
          <PhoneOff className="size-7" />
        </button>
        {!answered && (
          <button
            type="button"
            aria-label="Answer call"
            onClick={() => setAnswered(true)}
            className="grid size-16 animate-pulse place-items-center rounded-full bg-safe text-safe-foreground shadow-lift"
          >
            <Phone className="size-7" />
          </button>
        )}
      </div>
    </div>
  );
}
