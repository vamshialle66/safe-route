import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "@/components/layout/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";

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
  return (
    <AuthShell title="Welcome back" subtitle="Log in to keep your saved routes, trips and contacts with you.">
      <AuthForm mode="login" />
    </AuthShell>
  );
}
