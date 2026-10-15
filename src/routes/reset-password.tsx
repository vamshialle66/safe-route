import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — SafeRoute" },
      { name: "description", content: "Choose a new password for your SafeRoute account." },
      { property: "og:title", content: "Reset Password — SafeRoute" },
      { property: "og:description", content: "Choose a new SafeRoute password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <AuthShell title="Choose a new password" subtitle="Enter a new password for your account.">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (password.length < 6) return setError("Password must be at least 6 characters.");
          const { error } = await supabase.auth.updateUser({ password });
          if (error) return setError(error.message);
          toast.success("Password updated");
          navigate({ to: "/dashboard" });
        }}
      >
        <div>
          <Label htmlFor="pw">New password</Label>
          <Input id="pw" type="password" className="mt-1.5 h-11" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </div>
        {error && <p role="alert" className="rounded-xl border border-risk/40 bg-risk-soft px-4 py-3 text-sm text-risk">{error}</p>}
        <Button type="submit" size="lg" className="w-full">Update password</Button>
      </form>
    </AuthShell>
  );
}
