import type { ScoutBot } from "./types";
import type { Signal } from "./types";
import { normalizeSignals } from "./base";

const SEARCH_TERMS = [
  "AI side hustle",
  "freelance writing",
  "email sequence",
  "pet portrait",
  "logo design",
  "social media management",
  "virtual assistant",
  "copywriting",
];

/**
 * Google Trends doesn't have an official public API. We use a placeholder that
 * returns empty unless you plug in a proxy or paid API. Env: GOOGLE_TRENDS_API_KEY
 * or use a serverless-friendly proxy.
 */
async function fetchTrends(): Promise<{ term: string; value: number; type: string }[]> {
  const apiKey = process.env.GOOGLE_TRENDS_API_KEY;
  if (!apiKey) return [];

  try {
    // Optional: call a proxy or API that returns trending/breakout data per term.
    // Example placeholder: const res = await fetch(`https://...?key=${apiKey}&terms=...`);
    // For now we no-op so the app builds and deploys without the key.
    const res = await fetch(
      `https://serpapi.com/search.json?engine=google_trends_trending_now&api_key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      trending_searches?: { title?: string; approximate_traffic?: string }[];
    };
    const trending = data.trending_searches ?? [];
    return trending
      .filter((t) => t.title)
      .slice(0, 20)
      .map((t) => ({
        term: t.title!,
        value: parseInt(t.approximate_traffic ?? "0", 10) || 50,
        type: "breakout_search",
      }));
  } catch {
    return [];
  }
}

export const googleTrendsBot: ScoutBot = {
  name: "google_trends",
  async scan(): Promise<Signal[]> {
    try {
      const rows = await fetchTrends();
      const raw: Partial<Signal>[] = rows.map((r) => ({
        source: "google_trends",
        type: r.type,
        title: r.term,
        description: `Trending search: ${r.term}`,
        intensity: Math.min(100, 20 + Math.min(80, r.value)),
        rawData: r,
        detectedAt: new Date(),
      }));
      // Also add signals for our curated terms with placeholder intensity when we have no API
      if (rows.length === 0 && process.env.GOOGLE_TRENDS_API_KEY) {
        for (const term of SEARCH_TERMS) {
          raw.push({
            source: "google_trends",
            type: "breakout_search",
            title: term,
            description: `Curated term: ${term}`,
            intensity: 50,
            detectedAt: new Date(),
          });
        }
      }
      return normalizeSignals(raw);
    } catch {
      return [];
    }
  },
};
