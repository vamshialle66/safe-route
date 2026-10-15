import { describe, expect, it } from "vitest";
import { placeIndex, routeIndex, splitLine } from "../engine.server";
import type { ApiSegment } from "../saferouteApi";

const P = (openNow: boolean | null) => ({ name: "x", latitude: 0, longitude: 0, openNow });

describe("safety index rules", () => {
  it("index is the share of scored places open right now", () => {
    expect(placeIndex([P(true), P(true), P(false), P(null)]).safetyIndex).toBeCloseTo(66.67, 1);
  });
  it("is null when no place has opening data", () => {
    expect(placeIndex([P(null)]).safetyIndex).toBeNull();
  });
  it("route index is length-weighted over scored segments", () => {
    const seg = (len: number, idx: number | null) => ({ lengthMeters: len, safetyIndex: idx }) as ApiSegment;
    expect(routeIndex([seg(100, 100), seg(300, 0), seg(500, null)]).safetyIndex).toBe(25);
  });
  it("splits lines into ~100 m pieces", () => {
    const line = [{ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 0.0045 }]; // ~500 m
    expect(splitLine(line).length).toBe(5);
  });
});
