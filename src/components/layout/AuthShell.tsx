import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-hero p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-primary/40 blur-3xl" aria-hidden="true" />
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
