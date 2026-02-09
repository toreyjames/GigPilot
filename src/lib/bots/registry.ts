import type { ScoutBot } from "./types";
import { redditBot } from "./reddit";
import { googleTrendsBot } from "./google-trends";
import { xBot } from "./x";
import { hackerNewsBot } from "./hackernews";
import { productHuntBot } from "./producthunt";

export const bots: ScoutBot[] = [
  redditBot,
  googleTrendsBot,
  xBot,
  hackerNewsBot,
  productHuntBot,
];
