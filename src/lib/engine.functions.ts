import { createServerFn } from "@tanstack/react-start";
import type { ApiRoute, BackendTravelMode, LatLng, NearbyResponse } from "./saferouteApi";

const MODES: BackendTravelMode[] = ["DRIVE", "BICYCLE", "WALK", "TWO_WHEELER", "TRANSIT"];

function point(p: unknown): LatLng {
  const q = p as LatLng;
  if (!q || !Number.isFinite(q.latitude) || !Number.isFinite(q.longitude) || Math.abs(q.latitude) > 90 || Math.abs(q.longitude) > 180)
    throw new Error("Invalid coordinates");
  return { latitude: Number(q.latitude), longitude: Number(q.longitude) };
}

export type EngineResult<T> = { ok: true; data: T } | { ok: false; reason: string };

export const liveSegmentsFn = createServerFn({ method: "POST" })
  .inputValidator((d: { origin: LatLng; destination: LatLng; travelMode: BackendTravelMode }) => {
    if (!MODES.includes(d?.travelMode)) throw new Error("Invalid travel mode");
    return { origin: point(d.origin), destination: point(d.destination), travelMode: d.travelMode };
  })
  .handler(async ({ data }): Promise<EngineResult<{ routes: ApiRoute[] }>> => {
    const { liveSegments } = await import("./engine.server");
    try {
      return { ok: true, data: await liveSegments(data.origin, data.destination, data.travelMode) };
    } catch (e) {
      console.error("liveSegments failed", e);
      return { ok: false, reason: e instanceof Error ? e.message : "Live service unavailable." };
    }
  });

export const liveNearbyFn = createServerFn({ method: "POST" })
  .inputValidator((d: LatLng) => point(d))
  .handler(async ({ data }): Promise<EngineResult<NearbyResponse>> => {
    const { liveNearby } = await import("./engine.server");
    try {
      return { ok: true, data: await liveNearby(data) };
    } catch (e) {
      console.error("liveNearby failed", e);
      return { ok: false, reason: e instanceof Error ? e.message : "Live service unavailable." };
    }
  });
