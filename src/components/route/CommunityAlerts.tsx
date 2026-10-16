import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquareWarning, Sparkles, Loader2, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/lib/session";
import { ALERT_CATEGORIES, ALERT_URGENCY, concernSchema, reviewSchema } from "@/lib/communityAlerts";
import { classifyAlertFn, listAlertsFn, reviewAlertFn, deleteAlertFn } from "@/lib/communityAlerts.functions";
import type { Database } from "@/integrations/supabase/types";

type Alert = Database["public"]["Tables"]["community_alerts"]["Row"];
export function CommunityAlerts({ journeyId, routeLabel }: { journeyId: string; routeLabel: string }) {
  const { user } = useSession();
  const classify = useServerFn(classifyAlertFn);
  const list = useServerFn(listAlertsFn);
  const review = useServerFn(reviewAlertFn);
  const remove = useServerFn(deleteAlertFn);
  const cache = useQueryClient();
  const key = ["community-alerts", user?.id, journeyId];
  const saved = useQuery({ queryKey: key, queryFn: () => list({ data: { journeyId } }), enabled: !!user });
  const [editing, setEditing] = useState(false);
  const [concern, setConcern] = useState("");
  const [location, setLocation] = useState("");
  const [draft, setDraft] = useState<Alert | null>(null);
  const [category, setCategory] = useState("other");
  const [urgency, setUrgency] = useState("informational");
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function edit(alert: Alert) {
    setDraft(alert); setCategory(alert.category); setUrgency(alert.urgency); setSummary(alert.summary);
    setConcern(alert.concern); setLocation(alert.location_label); setEditing(true); setError(""); setSuccess("");
  }
  async function classifyInput() {
    setError(""); setSuccess("");
    const valid = concernSchema.safeParse({ journeyId, routeLabel, locationLabel: location, concern });
    if (!valid.success) { setError(valid.error.issues[0]?.message ?? "Please check your description."); return; }
    setBusy(true);
    try {
      const result = await classify({ data: valid.data });
      if (!result.alert) { setError(result.error ?? "AI classification unavailable."); return; }
      edit(result.alert); await cache.invalidateQueries({ queryKey: key });
    } catch (e) { setError(e instanceof Error ? e.message : "The concern could not be classified."); }
    finally { setBusy(false); }
  }
  async function saveReview() {
    if (!draft) return;
    setError("");
    const valid = reviewSchema.safeParse({ id: draft.id, category, urgency, summary });
    if (!valid.success) { setError("Please choose a category and describe the concern in 10–500 characters."); return; }
    setBusy(true);
    try {
      await review({ data: valid.data }); await cache.invalidateQueries({ queryKey: key });
      setDraft(null); setEditing(false); setConcern(""); setLocation("");
      setSuccess("Alert saved for review. It remains unverified and private to your account.");
    } catch (e) { setError(e instanceof Error ? e.message : "Your review could not be saved."); }
    finally { setBusy(false); }
  }
  async function discard(id: string) {
    setBusy(true); setError("");
    try {
      await remove({ data: { id } }); await cache.invalidateQueries({ queryKey: key });
      if (draft?.id === id) { setDraft(null); setEditing(false); }
    } catch { setError("Your alert could not be deleted."); }
    finally { setBusy(false); }
  }

  return <section className="border-y border-border py-5" aria-label="Community alerts">
    <div className="flex items-center gap-2"><MessageSquareWarning className="size-5 shrink-0 text-primary" /><h2 className="font-display font-semibold">Community alerts</h2></div>
    <p className="mt-2 text-sm text-muted-foreground">Describe something you noticed on this route. AI suggests a category; you check the wording. Reports are unverified, private to your account and do not change route scores.</p>
    <p className="mt-2 text-xs text-muted-foreground">In immediate danger? <Link to="/emergency" className="text-risk underline">Get emergency help</Link>. Reporting here does not contact emergency services.</p>
    {!user ? <Button asChild variant="outline" className="mt-4"><Link to="/login">Sign in to report a concern</Link></Button> : <>
      {!editing && <Button variant="outline" className="mt-4" onClick={() => { setDraft(null); setConcern(""); setLocation(""); setEditing(true); setError(""); setSuccess(""); }}><MessageSquareWarning className="size-4" /> Report a concern</Button>}
      {editing && <form className="mt-4 space-y-4" onSubmit={e => { e.preventDefault(); void (draft ? saveReview() : classifyInput()); }}>
        <p className="text-sm font-semibold">{draft ? "Review your community alert" : "What did you notice?"}</p>
        {!draft ? <>
          <div className="space-y-2"><Label htmlFor="concern-location">Where along the route?</Label><Input id="concern-location" value={location} onChange={e => setLocation(e.target.value)} maxLength={250} placeholder="For example, near the station entrance" disabled={busy} required /></div>
          <div className="space-y-2"><Label htmlFor="concern-description">Describe your concern</Label><Textarea id="concern-description" value={concern} onChange={e => setConcern(e.target.value)} maxLength={2000} rows={4} placeholder="For example, the path near the station was very dark this evening." disabled={busy} required /><p className="text-xs text-muted-foreground">Avoid names, phone numbers and personal details. Your description is sent to AI for classification. {concern.length}/2000</p></div>
        </> : <>
          <p className="text-xs font-semibold text-moderate">AI-classified · Unverified · Not published</p>
          <p className="break-words text-sm text-muted-foreground">Location: {draft.location_label}</p>
          <div className="space-y-2"><Label htmlFor="alert-category">Category</Label><Select value={category} onValueChange={setCategory} disabled={busy}><SelectTrigger id="alert-category"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(ALERT_CATEGORIES).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="alert-urgency">Suggested attention</Label><Select value={urgency} onValueChange={setUrgency} disabled={busy}><SelectTrigger id="alert-urgency"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(ALERT_URGENCY).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="alert-summary">Alert wording</Label><Textarea id="alert-summary" value={summary} onChange={e => setSummary(e.target.value)} maxLength={500} rows={4} disabled={busy} required /></div>
          {urgency === "urgent" && <p className="text-sm text-risk">If someone needs help now, use emergency tools rather than waiting for review.</p>}
          <p className="text-xs text-muted-foreground">AI can misunderstand. Check the category and wording before saving. No public sharing or moderator approval is enabled yet.</p>
        </>}
        <div className="flex flex-wrap gap-2"><Button type="submit" disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}{busy ? "Please wait…" : draft ? "Save for review" : "Classify with AI"}</Button><Button type="button" variant="ghost" disabled={busy} onClick={() => { setEditing(false); setError(""); }}>Close</Button></div>
      </form>}
      {saved.isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading your alerts…</p>}
      {saved.error && <div className="mt-3 text-sm text-risk">Your alerts could not be loaded. <Button variant="ghost" size="sm" onClick={() => void saved.refetch()}>Try again</Button></div>}
      {!!saved.data?.length && <div className="mt-5"><h3 className="text-sm font-semibold">Your reports for this journey</h3><ul className="mt-2 divide-y divide-border">{saved.data.map(alert => <li key={alert.id} className="py-3">
        <p className="text-xs font-semibold text-moderate">Community alert · Unverified · {alert.status === "draft" ? "Draft" : "Awaiting review"}</p>
        <p className="mt-1 text-sm font-medium">{ALERT_CATEGORIES[alert.category as keyof typeof ALERT_CATEGORIES]}</p><p className="mt-1 break-words text-sm">{alert.summary}</p><p className="mt-1 break-words text-xs text-muted-foreground">{alert.route_label} · {alert.location_label} · {ALERT_URGENCY[alert.urgency as keyof typeof ALERT_URGENCY]}</p>
        <div className="mt-2 flex gap-2"><Button variant="ghost" size="sm" disabled={busy} onClick={() => edit(alert)}><Pencil className="size-3.5" /> Review</Button><Button variant="ghost" size="sm" disabled={busy} onClick={() => void discard(alert.id)}><Trash2 className="size-3.5" /> Delete</Button></div>
      </li>)}</ul></div>}
    </>}
    {error && <p role="alert" className="mt-3 break-words text-sm text-risk">{error}</p>}
    {success && <p role="status" className="mt-3 text-sm text-safe">{success}</p>}
  </section>;
}