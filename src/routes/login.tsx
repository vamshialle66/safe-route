import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/services/userService";

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

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-brand-gradient p-12 lg:flex">
        <Link to="/" aria-label="SafeRoute home">
          <Logo variant="inverted" />
        </Link>
        <div>
          <h2 className="max-w-sm text-3xl font-semibold text-primary-foreground">
            Your destination matters. So does how you get there.
          </h2>
          <ul className="mt-8 space-y-3 text-sm text-primary-foreground/85">
            {[
              "Safety-scored route comparison",
              "Segment-level risk visibility",
              "Emergency contacts and quick actions",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <ShieldCheck className="size-4" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/70">
          Sample data is used throughout this preview experience.
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden">
            <Link to="/" aria-label="SafeRoute home">
              <Logo />
            </Link>
          </div>
          <h1 className="mt-8 font-display text-2xl font-semibold lg:mt-0">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
