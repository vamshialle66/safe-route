import { analysisStore, type Analysis, type NamedPoint } from "./analysisStore";
import { demoSegments } from "./demoAnalysis";
import { liveNearbyFn, liveSegmentsFn } from "./engine.functions";
import { ApiError, getCustomApiUrl, getDemoOnly, saferouteApi, type ApiRoute, type BackendTravelMode, type LatLng, type NearbyResponse } from "./saferouteApi";

type Live<T> = { ok: true; data: T } | { ok: false; reason: string };

async function external<T>(call: () => Promise<T>): Promise<Live<T>> {
  try {
    return { ok: true, data: await call() };
  } catch (e) {
    if (e instanceof ApiError && e.unreachable) return { ok: false, reason: "Your SafeRoute server couldn't be reached." };
    throw e;
  }
}

async function builtIn<T>(call: () => Promise<Live<T>>): Promise<Live<T>> {
  try {
    return await call();
  } catch {
    return { ok: false, reason: "The live service couldn't be reached." };
  }
}

/** Live nearby places: custom server if set, else built-in Google engine. */
export function fetchNearby(p: LatLng): Promise<Live<NearbyResponse>> {
  return getCustomApiUrl() ? external(() => saferouteApi.nearby(p)) : builtIn(() => liveNearbyFn({ data: p }));
}

export async function runAnalysis(
  origin: NamedPoint,
  destination: NamedPoint,
  travelMode: BackendTravelMode,
): Promise<{ analysis: Analysis; fellBack: boolean; reason?: string }> {
  let source: Analysis["source"] = "live";
  let reason: string | undefined;
  let routes: ApiRoute[];
  if (getDemoOnly()) {
    source = "demo";
    await new Promise((r) => setTimeout(r, 900));
    routes = demoSegments(origin, destination, travelMode).routes;
  } else {
    const o = { latitude: origin.latitude, longitude: origin.longitude };
    const d = { latitude: destination.latitude, longitude: destination.longitude };
    const r = getCustomApiUrl()
      ? await external(() => saferouteApi.segments(o, d, travelMode))
      : await builtIn(() => liveSegmentsFn({ data: { origin: o, destination: d, travelMode } }));
    if (r.ok) routes = r.data.routes;
    else {
      source = "demo";
      reason = r.reason;
      routes = demoSegments(origin, destination, travelMode).routes;
    }
  }
  const analysis: Analysis = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    origin,
    destination,
    travelMode,
    source,
    ...(reason ? { fallbackReason: reason } : {}),
    routes,
  };
  analysisStore.setCurrent(analysis);
  return { analysis, fellBack: source === "demo" && !getDemoOnly(), ...(reason ? { reason } : {}) };
}
