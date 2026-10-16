import { z } from "zod";

export const ALERT_CATEGORIES = {
  lighting: "Poor lighting",
  harassment: "Harassment or unwanted attention",
  obstruction: "Blocked or damaged path",
  suspicious_activity: "Concerning behaviour",
  other: "Other concern",
} as const;
export const ALERT_URGENCY = { informational: "For awareness", caution: "Use caution", urgent: "May need immediate help" } as const;
export const classificationSchema = z.object({
  category: z.enum(["lighting", "harassment", "obstruction", "suspicious_activity", "other"]),
  urgency: z.enum(["informational", "caution", "urgent"]),
  summary: z.string(),
}).strict();
export const concernSchema = z.object({
  journeyId: z.string().min(1).max(100),
  routeLabel: z.string().min(1).max(250),
  locationLabel: z.string().trim().min(3).max(250),
  concern: z.string().trim().min(20, "Please describe what happened in at least 20 characters.").max(2000),
});
export const reviewSchema = classificationSchema.extend({ id: z.string().uuid(), summary: z.string().trim().min(10).max(500) });
export function unverifiedDraft(input: z.infer<typeof classificationSchema>) {
  return { ...input, summary: input.summary.trim().slice(0, 500), status: "draft" as const, verification: "unverified" as const };
}