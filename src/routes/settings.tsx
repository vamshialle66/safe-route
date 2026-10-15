import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Server, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getApiUrl, getDemoOnly, saferouteApi, setApiUrl, setDemoOnly } from "@/lib/saferouteApi";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SafeRoute" },
      { name: "description", content: "Connect SafeRoute to your route engine and choose app preferences." },
      { property: "og:title", content: "Settings — SafeRoute" },
      { property: "og:description", content: "SafeRoute app settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [url, setUrl] = useState("");
  const [demo, setDemo] = useState(false);
  const [status, setStatus] = useState<"idle" | "checking" | "ok" | "fail">("idle");

  useEffect(() => {
    setUrl(getApiUrl());
    setDemo(getDemoOnly());
  }, []);

  async function test() {
    setApiUrl(url);
    setStatus("checking");
    setStatus((await saferouteApi.ping()) ? "ok" : "fail");
  }

  return (
    <AppLayout title="Settings">
      <div className="mx-auto max-w-2xl space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2"><Server className="size-4" /><h2 className="font-display font-semibold">Route engine</h2></div>
          <p className="mt-1 text-sm text-muted-foreground">The address where the SafeRoute server is running. On your own computer this is usually http://localhost:3000.</p>
          <Label htmlFor="url" className="mt-4 block">Server address</Label>
          <div className="mt-1.5 flex gap-2">
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="http://localhost:3000" />
            <Button onClick={test} disabled={status === "checking"}>
              {status === "checking" && <Loader2 className="size-4 animate-spin" />} Test & save
            </Button>
          </div>
          {status === "ok" && <p className="mt-3 flex items-center gap-2 text-sm text-safe"><CheckCircle2 className="size-4" /> Connected.</p>}
          {status === "fail" && (
            <p className="mt-3 flex items-start gap-2 text-sm text-risk">
              <XCircle className="mt-0.5 size-4 shrink-0" /> Couldn't connect. Check the server is running and allows requests from this site.
            </p>
          )}
          <div className="mt-6 flex items-center justify-between rounded-xl bg-muted/60 p-4">
            <div>
              <p className="text-sm font-medium">Always use sample data</p>
              <p className="text-xs text-muted-foreground">Useful for demos without the server.</p>
            </div>
            <Switch checked={demo} onCheckedChange={(v) => { setDemo(v); setDemoOnly(v); toast.success(v ? "Sample data on" : "Live data on"); }} />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
