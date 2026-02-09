import type { ScoutBot } from "./types";
import type { Signal } from "./types";
import { normalizeSignals } from "./base";

const PHRASES = [
  "I wish someone would",
  "I'd pay for",
  "need a tool for",
  "someone should make",
  "wish there was an app",
];

async function searchTweets(query: string): Promise<{ text: string; id: string; url: string }[]> {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) return [];

  const params = new URLSearchParams({
    query: `"${query}" -is:retweet lang:en`,
    "tweet.fields": "created_at,public_metrics",
    "user.fields": "public_metrics",
    max_results: "20",
  });
  const res = await fetch(
    `https://api.twitter.com/2/tweets/search/recent?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) return [];
  const data = (await res.json()) as {
    data?: { id: string; text: string }[];
  };
  const tweets = data.data ?? [];
  return tweets.map((t) => ({
    text: t.text,
    id: t.id,
    url: `https://twitter.com/i/status/${t.id}`,
  }));
}

export const xBot: ScoutBot = {
  name: "x",
  async scan(): Promise<Signal[]> {
    try {
      if (!process.env.X_BEARER_TOKEN) return [];
      const raw: Partial<Signal>[] = [];
      const seen = new Set<string>();
      for (const phrase of PHRASES) {
        const tweets = await searchTweets(phrase);
        for (const t of tweets) {
          const key = t.id;
          if (seen.has(key)) continue;
          seen.add(key);
          raw.push({
            source: "x",
            type: "complaint",
            title: t.text.slice(0, 120),
            description: t.text,
            intensity: 60,
            rawData: { id: t.id },
            sourceUrl: t.url,
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
