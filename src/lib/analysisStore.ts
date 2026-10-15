import { useSyncExternalStore } from "react";
import type { ApiRoute, BackendTravelMode, LatLng } from "./saferouteApi";

export interface NamedPoint extends LatLng {
  label: string;
}

export interface Analysis {
  id: string;
  createdAt: string;
  origin: NamedPoint;
  destination: NamedPoint;
  travelMode: BackendTravelMode;
  source: "live" | "demo";
  routes: ApiRoute[];
}

const CURRENT = "saferoute.analysis";
const HISTORY = "saferoute.history";
const SAVED = "saferoute.saved";

type Listener = () => void;
const listeners = new Set<Listener>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = fallback;
  try {
    value = raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    /* ignore */
  }
  cache.set(key, { raw, value });
  return value;
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota: drop place details from history */
  }
  listeners.forEach((l) => l());
}
function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const EMPTY: Analysis[] = [];

export interface SavedItem {
  id: string;
  analysisId: string;
  routeNumber: number;
  name: string;
  savedAt: string;
}
const EMPTY_SAVED: SavedItem[] = [];

export const analysisStore = {
  current: () => read<Analysis | null>(CURRENT, null),
  history: () => read<Analysis[]>(HISTORY, EMPTY),
  saved: () => read<SavedItem[]>(SAVED, EMPTY_SAVED),
  setCurrent(a: Analysis) {
    write(CURRENT, a);
    const h = analysisStore.history().filter((x) => x.id !== a.id);
    write(HISTORY, [a, ...h].slice(0, 8));
  },
  open(id: string) {
    const a = analysisStore.history().find((x) => x.id === id);
    if (a) write(CURRENT, a);
    return a;
  },
  clearHistory() {
    write(HISTORY, []);
  },
  saveRoute(a: Analysis, routeNumber: number) {
    const list = analysisStore.saved();
    if (list.some((s) => s.analysisId === a.id && s.routeNumber === routeNumber)) return false;
    write(SAVED, [
      {
        id: crypto.randomUUID(),
        analysisId: a.id,
        routeNumber,
        name: `${a.origin.label.split(",")[0]} → ${a.destination.label.split(",")[0]}`,
        savedAt: new Date().toISOString(),
      },
      ...list,
    ]);
    return true;
  },
  removeSaved(id: string) {
    write(SAVED, analysisStore.saved().filter((s) => s.id !== id));
  },
};

export function useCurrentAnalysis() {
  return useSyncExternalStore(subscribe, analysisStore.current, () => null);
}
export function useHistory() {
  return useSyncExternalStore(subscribe, analysisStore.history, () => EMPTY);
}
export function useSaved() {
  return useSyncExternalStore(subscribe, analysisStore.saved, () => EMPTY_SAVED);
}
