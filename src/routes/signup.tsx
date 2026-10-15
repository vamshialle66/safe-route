import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "@/components/layout/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — SafeRoute" },
      {
        name: "description",
        content: "Create a SafeRoute account to plan safety-scored routes, review saved journeys and manage emergency contacts.",
      },
      { property: "og:title", content: "Create your SafeRoute account" },
      { property: "og:description", content: "Access your safety-scored route planner." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <AuthShell title="Create your account" subtitle="Save routes, trips and trusted contacts to your own account.">
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
