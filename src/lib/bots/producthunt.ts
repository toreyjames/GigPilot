import type { ScoutBot } from "./types";
import type { Signal } from "./types";
import { normalizeSignals } from "./base";

const PH_GRAPHQL = "https://api.producthunt.com/v2/api/graphql";

const POSTS_QUERY = `
  query RecentPosts($first: Int!) {
    posts(first: $first, order: RANKING) {
      edges {
        node {
          id
          name
          tagline
          url
          votesCount
          commentsCount
        }
      }
    }
  }
`;

type PHPost = {
  id: string;
  name: string;
  tagline: string | null;
  url: string | null;
  votesCount: number;
  commentsCount: number;
};

async function fetchRecentPosts(token: string): Promise<PHPost[]> {
  const res = await fetch(PH_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: POSTS_QUERY,
      variables: { first: 25 },
    }),
  });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    data?: {
      posts?: {
        edges?: { node?: PHPost }[];
      };
    };
    errors?: unknown[];
  };
  if (json.errors?.length) return [];
  const edges = json.data?.posts?.edges ?? [];
  return edges
    .map((e) => e.node)
    .filter((n): n is PHPost => !!n?.id && !!n?.name);
}

export const productHuntBot: ScoutBot = {
  name: "product_hunt",
  async scan(): Promise<Signal[]> {
    try {
      const token = process.env.PRODUCT_HUNT_API_KEY?.trim();
      if (!token) return [];

      const posts = await fetchRecentPosts(token);
      const raw: Partial<Signal>[] = posts.map((p) => {
        const intensity = Math.min(
          100,
          30 + Math.floor((p.votesCount ?? 0) / 5) + (p.commentsCount ?? 0) * 2
        );
        const title = p.name;
        const description = p.tagline
          ? `Launch: ${p.name}. ${p.tagline}`
          : `Launch: ${p.name}`;
        const sourceUrl = p.url ?? `https://www.producthunt.com/posts/${p.name.toLowerCase().replace(/\s+/g, "-")}`;
        return {
          source: "product_hunt",
          type: "launch",
          title,
          description: description.slice(0, 500),
          intensity,
          rawData: {
            id: p.id,
            votesCount: p.votesCount,
            commentsCount: p.commentsCount,
          },
          sourceUrl,
          detectedAt: new Date(),
        };
      });
      return normalizeSignals(raw);
    } catch {
      return [];
    }
  },
};
