import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/services/userService";
import { AuthShell } from "@/components/layout/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log In — SafeRoute" },
      {
        name: "description",
        content: "Log in to SafeRoute to plan safety-scored routes, review saved journeys and manage emergency contacts.",
      },
      { property: "og:title", content: "Log in to SafeRoute" },
      { property: "og:description", content: "Access your safety-scored route planner." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("aarya.menon@example.com");
  const [password, setPassword] = useState("saferoute");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login({ email, password });
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue planning safer journeys."
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 pl-9"
              autoComplete="email"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pl-9"
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <Checkbox defaultChecked aria-label="Keep me logged in" />
            Keep me logged in
          </label>
          <Link to="/login" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-risk/40 bg-risk-soft px-4 py-3 text-sm text-risk">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {loading ? "Logging in…" : "Log In"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={async () => {
          setLoading(true);
          await authService.loginWithGoogle();
          setLoading(false);
          toast.success("Signed in with Google");
          navigate({ to: "/dashboard" });
        }}
        disabled={loading}
      >
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to SafeRoute?{" "}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

