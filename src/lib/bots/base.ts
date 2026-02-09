import type { Signal, ScoutBot } from "./types";

export type { Signal, ScoutBot } from "./types";

const MIN_INTENSITY = 0;
const MAX_INTENSITY = 100;

/**
 * Clamp intensity to valid range and ensure required string fields are non-empty.
 */
export function normalizeSignal(s: Partial<Signal>): Signal | null {
  if (
    !s.source?.trim() ||
    !s.type?.trim() ||
    !s.title?.trim() ||
    typeof s.intensity !== "number"
  ) {
    return null;
  }
  const intensity = Math.min(
    MAX_INTENSITY,
    Math.max(MIN_INTENSITY, Math.round(s.intensity))
  );
  return {
    source: s.source.trim(),
    type: s.type.trim(),
    title: s.title.trim(),
    description: typeof s.description === "string" ? s.description.trim() : "",
    intensity,
    rawData: s.rawData,
    sourceUrl: s.sourceUrl?.trim() || undefined,
    detectedAt: s.detectedAt instanceof Date ? s.detectedAt : new Date(),
  };
}

/**
 * Filter and normalize an array of raw signals.
 */
export function normalizeSignals(signals: Partial<Signal>[]): Signal[] {
  const out: Signal[] = [];
  for (const s of signals) {
    const n = normalizeSignal(s);
    if (n) out.push(n);
  }
  return out;
}
