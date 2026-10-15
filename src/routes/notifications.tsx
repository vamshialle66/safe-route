import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/components/common/NotificationItem";
import { NOTIFICATIONS } from "@/data/mockData";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — SafeRoute" },
      { name: "description", content: "Updates about your routes, location sharing and account." },
      { property: "og:title", content: "Notifications — SafeRoute" },
      { property: "og:description", content: "Your SafeRoute updates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [items, setItems] = useState(NOTIFICATIONS);
  return (
    <AppLayout
      title="Notifications"
      actions={<Button variant="outline" onClick={() => setItems(items.map((i) => ({ ...i, read: true })))}>Mark all read</Button>}
    >
      <div className="mx-auto max-w-2xl space-y-2">
        {items.map((n) => (
          <NotificationItem key={n.id} notification={n} onToggleRead={(id) => setItems(items.map((i) => (i.id === id ? { ...i, read: !i.read } : i)))} />
        ))}
      </div>
    </AppLayout>
  );
}
