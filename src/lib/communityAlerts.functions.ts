import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { concernSchema, reviewSchema, unverifiedDraft } from "./communityAlerts";
import { classifyConcern, AlertAIError, ALERT_MODEL } from "./communityAlerts.server";

export const classifyAlertFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(input => concernSchema.parse(input))
  .handler(async ({ data, context }) => {
    // Privileged access is limited to the durable provider circuit breaker, after authentication.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const block = await supabaseAdmin.from("ai_feature_state").select("safe_message").eq("feature", "community-alerts").maybeSingle();
    if (block.error) return { alert: null, error: "AI availability could not be checked. Please try again later." };
    if (block.data) return { alert: null, error: block.data.safe_message };
    try {
      const classification = unverifiedDraft(await classifyConcern(data.concern));
      const { data: alert, error } = await context.supabase.from("community_alerts").insert({
        ...classification, user_id: context.userId, journey_id: data.journeyId,
        route_label: data.routeLabel, location_label: data.locationLabel, concern: data.concern, model: ALERT_MODEL,
      }).select().single();
      if (error) return { alert: null, error: "The draft could not be saved. Your original description is still here." };
      return { alert, error: null };
    } catch (error) {
      const message = error instanceof AlertAIError ? error.message : "AI classification is unavailable. Nothing was published.";
      if (error instanceof AlertAIError && error.blocked) {
        const { error: persistError } = await supabaseAdmin.from("ai_feature_state").upsert({ feature: "community-alerts", safe_message: message });
        if (persistError) console.error("Unable to persist AI feature block", persistError.code);
      }
      return { alert: null, error: message };
    }
  });

export const listAlertsFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ journeyId: z.string().min(1).max(100) }).parse(input))
  .handler(async ({ data, context }) => {
    const result = await context.supabase.from("community_alerts").select().eq("user_id", context.userId).eq("journey_id", data.journeyId).order("created_at", { ascending: false }).limit(20);
    if (result.error) throw new Error("Your saved alerts could not be loaded.");
    return result.data;
  });

export const reviewAlertFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(input => reviewSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const result = await context.supabase.from("community_alerts").update({ ...patch, status: "pending_review", reviewed_at: new Date().toISOString() }).eq("id", id).eq("user_id", context.userId).select().single();
    if (result.error) throw new Error("Your review could not be saved. Please try again.");
    return result.data;
  });

export const deleteAlertFn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const result = await context.supabase.from("community_alerts").delete().eq("id", data.id).eq("user_id", context.userId);
    if (result.error) throw new Error("Your alert could not be deleted.");
    return { ok: true };
  });