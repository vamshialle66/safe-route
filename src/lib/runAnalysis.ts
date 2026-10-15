import { analysisStore, type Analysis, type NamedPoint } from "./analysisStore";
import { demoSegments } from "./demoAnalysis";
import { ApiError, getDemoOnly, saferouteApi, type BackendTravelMode } from "./saferouteApi";

export async function runAnalysis(
  origin: NamedPoint,
  destination: NamedPoint,
  travelMode: BackendTravelMode,
): Promise<{ analysis: Analysis; fellBack: boolean }> {
  let source: Analysis["source"] = "live";
  let fellBack = false;
  let routes;
  if (getDemoOnly()) {
    source = "demo";
    await new Promise((r) => setTimeout(r, 900));
    routes = demoSegments(origin, destination, travelMode).routes;
  } else {
    try {
      routes = (await saferouteApi.segments(origin, destination, travelMode)).routes;
    } catch (e) {
      if (e instanceof ApiError && e.unreachable) {
        source = "demo";
        fellBack = true;
        routes = demoSegments(origin, destination, travelMode).routes;
      } else throw e;
    }
  }
  const analysis: Analysis = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    origin,
    destination,
    travelMode,
    source,
    routes,
  };
  analysisStore.setCurrent(analysis);
  return { analysis, fellBack };
}
