import type { ScoutBot } from "./types";
import type { Signal } from "./types";
import { normalizeSignals } from "./base";

const SUBREDDITS = [
  "SomebodyMakeThis",
  "Entrepreneur",
  "smallbusiness",
  "SideProject",
  "startups",
];
const KEYWORDS = [
  "i wish",
  "someone should",
  "need help with",
  "would pay",
  "i'd pay",
  "someone make",
  "wish there was",
  "need a tool",
  "looking for something",
];

function matchesKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return KEYWORDS.some((k) => lower.includes(k));
}

async function fetchRedditListing(
  subreddit: string,
  sort: "hot" | "new",
  limit: number
): Promise<{ title: string; selftext: string; url: string; ups: number; created_utc: number }[]> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  if (!clientId || !clientSecret) return [];

  const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!tokenRes.ok) return [];
  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokenJson.access_token;
  if (!accessToken) return [];

  const listingRes = await fetch(
    `https://oauth.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!listingRes.ok) return [];
  const listing = (await listingRes.json()) as {
    data?: { children?: { data?: { title?: string; selftext?: string; url?: string; ups?: number; created_utc?: number } }[] };
  };
  const children = listing.data?.children ?? [];
  return children
    .map((c) => c.data)
    .filter(
      (d): d is { title: string; selftext: string; url: string; ups: number; created_utc: number } =>
        !!d?.title && typeof d.ups === "number"
    )
    .map((d) => ({
      title: d.title,
      selftext: d.selftext ?? "",
      url: d.url ?? "",
      ups: d.ups,
      created_utc: d.created_utc ?? 0,
    }));
}

export const redditBot: ScoutBot = {
  name: "reddit",
  async scan(): Promise<Signal[]> {
    try {
      if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_CLIENT_SECRET) {
        return [];
      }
      const raw: Partial<Signal>[] = [];
      for (const sub of SUBREDDITS) {
        const hot = await fetchRedditListing(sub, "hot", 25);
        const new_ = await fetchRedditListing(sub, "new", 15);
        const seen = new Set<string>();
        for (const p of [...hot, ...new_]) {
          const key = `${sub}:${p.url}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const text = `${p.title} ${p.selftext}`;
          if (!matchesKeywords(text)) continue;
          const ageHours = (Date.now() / 1000 - p.created_utc) / 3600;
          const recency = Math.max(0, 100 - ageHours * 2);
          const intensity = Math.min(100, Math.round((p.ups / 10) * 5 + recency * 0.5));
          raw.push({
            source: "reddit",
            type: "pain_post",
            title: p.title,
            description: p.selftext.slice(0, 500),
            intensity,
            rawData: { subreddit: sub, ups: p.ups, created_utc: p.created_utc },
            sourceUrl: p.url,
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
