import type { ScoutBot } from "./types";
import type { Signal } from "./types";
import { normalizeSignals } from "./base";

const KEYWORDS = [
  "i wish",
  "would pay",
  "i'd pay",
  "someone should",
  "need a tool",
  "someone make",
  "wish there was",
  "need help with",
  "looking for something",
];

const ALGOLIA_BASE = "https://hn.algolia.com/api/v1";

type AlgoliaHit = {
  title?: string | null;
  story_text?: string | null;
  comment_text?: string | null;
  url?: string | null;
  points?: number;
  num_comments?: number;
  objectID: string;
  _tags?: string[];
  created_at_i?: number;
};

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function matchesKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return KEYWORDS.some((k) => lower.includes(k));
}

async function searchHN(
  query: string,
  tags: string,
  createdSince: number,
  hitsPerPage: number
): Promise<AlgoliaHit[]> {
  const params = new URLSearchParams({
    query,
    tags,
    hitsPerPage: String(hitsPerPage),
    numericFilters: `created_at_i>${createdSince}`,
  });
  const res = await fetch(`${ALGOLIA_BASE}/search_by_date?${params}`);
  if (!res.ok) return [];
  const data = (await res.json()) as { hits?: AlgoliaHit[] };
  return data.hits ?? [];
}

export const hackerNewsBot: ScoutBot = {
  name: "hacker_news",
  async scan(): Promise<Signal[]> {
    try {
      const createdSince = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;
      const seen = new Set<string>();
      const raw: Partial<Signal>[] = [];

      const queries = ["would pay", "i wish", "someone should", "need a tool"];
      for (const q of queries) {
        const hits = await searchHN(
          q,
          "(story,comment)",
          createdSince,
          30
        );
        for (const h of hits) {
          const id = h.objectID;
          if (seen.has(id)) continue;
          seen.add(id);
          const title = h.title ?? h.story_text ?? h.comment_text ?? "";
          const description = h.story_text ?? h.comment_text ?? "";
          const text = `${title} ${description}`;
          if (!matchesKeywords(text)) continue;
          const points = h.points ?? 0;
          const comments = h.num_comments ?? 0;
          const intensity = Math.min(
            100,
            20 + Math.floor(points / 2) + comments * 2
          );
          const sourceUrl = `https://news.ycombinator.com/item?id=${id}`;
          raw.push({
            source: "hacker_news",
            type: h._tags?.includes("ask_hn") ? "ask_hn" : "pain_post",
            title: stripHtml(title).slice(0, 120),
            description: stripHtml(description).slice(0, 500),
            intensity,
            rawData: {
              objectID: h.objectID,
              points,
              num_comments: comments,
              _tags: h._tags,
            },
            sourceUrl,
            detectedAt: new Date(),
          });
        }
      }

      const askHnHits = await searchHN(
        "",
        "ask_hn",
        createdSince,
        25
      );
      for (const h of askHnHits) {
        const id = h.objectID;
        if (seen.has(id)) continue;
        seen.add(id);
        const title = h.title ?? h.story_text ?? "";
        const description = h.story_text ?? h.comment_text ?? "";
        const text = `${title} ${description}`;
        if (!matchesKeywords(text)) continue;
        const points = h.points ?? 0;
        const comments = h.num_comments ?? 0;
        const intensity = Math.min(
          100,
          20 + Math.floor(points / 2) + comments * 2
        );
        raw.push({
          source: "hacker_news",
          type: "ask_hn",
          title: stripHtml(title).slice(0, 120),
          description: stripHtml(description).slice(0, 500),
          intensity,
          rawData: { objectID: h.objectID, points, num_comments: comments },
          sourceUrl: `https://news.ycombinator.com/item?id=${id}`,
          detectedAt: new Date(),
        });
      }

      return normalizeSignals(raw);
    } catch {
      return [];
    }
  },
};
