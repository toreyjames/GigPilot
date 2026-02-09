/**
 * Parse avgEarnings string (e.g. "$75", "$50–150", "$25-50") to a midpoint number.
 */
export function parseAvgEarnings(s: string): number {
  const cleaned = s.replace(/\s/g, "").replace(/[$,]/g, "");
  const numbers = cleaned.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  if (numbers.length === 0) return 75;
  if (numbers.length === 1) return numbers[0];
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  return Math.round((min + max) / 2);
}

/**
 * Parse timeToDeliver string to approximate hours (e.g. "~20 min" -> 0.33, "~1–2 days" -> 18).
 */
export function parseTimeToDeliverHours(s: string): number {
  const lower = s.toLowerCase();
  const minMatch = lower.match(/(\d+)\s*min/);
  if (minMatch) return Math.max(0.08, Number(minMatch[1]) / 60);
  const hourMatch = lower.match(/(\d+)\s*h(?:our)?s?/);
  if (hourMatch) return Math.max(0.25, Number(hourMatch[1]));
  const dayMatch = lower.match(/(\d+)\s*d(?:ay)?s?/);
  if (dayMatch) return Math.max(0.5, Number(dayMatch[1]) * 8);
  return 1;
}

const WIN_RATE: Record<string, number> = {
  low: 1,
  medium: 0.7,
  high: 0.4,
};

/**
 * Estimated $/hr as a potential ROI proxy: (revenue × win rate × demand weight) / hours.
 */
export function computeEarningsPerHour(
  avgEarnings: string,
  timeToDeliver: string,
  competition: string,
  demandScore: number
): number {
  const revenue = parseAvgEarnings(avgEarnings);
  const hours = parseTimeToDeliverHours(timeToDeliver);
  const winRate = WIN_RATE[competition.toLowerCase()] ?? 0.7;
  const demandWeight = Math.min(1, Math.max(0, demandScore / 100));
  const value = revenue * winRate * demandWeight;
  return Math.round((value / hours) * 10) / 10;
}
