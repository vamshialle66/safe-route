import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_USER } from "@/data/mockData";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — SafeRoute" },
      { name: "description", content: "Your SafeRoute profile and contact details." },
      { property: "og:title", content: "Profile — SafeRoute" },
      { property: "og:description", content: "Manage your SafeRoute profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppLayout title="Profile">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
          <span className="grid size-16 place-items-center rounded-full bg-primary font-display text-xl font-semibold text-primary-foreground">{MOCK_USER.initials}</span>
          <div>
            <p className="font-display text-lg font-semibold">{MOCK_USER.name}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Mail className="size-3.5" />{MOCK_USER.email}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Phone className="size-3.5" />{MOCK_USER.phone}</p>
          </div>
        </div>
        <form className="space-y-4 rounded-2xl border border-border bg-card p-6" onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }}>
          <div><Label htmlFor="n">Full name</Label><Input id="n" className="mt-1.5" defaultValue={MOCK_USER.name} /></div>
          <div><Label htmlFor="e">Email</Label><Input id="e" type="email" className="mt-1.5" defaultValue={MOCK_USER.email} /></div>
          <div><Label htmlFor="p">Phone</Label><Input id="p" className="mt-1.5" defaultValue={MOCK_USER.phone} /></div>
          <div className="flex justify-between">
            <Button asChild variant="ghost"><Link to="/login">Log out</Link></Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
