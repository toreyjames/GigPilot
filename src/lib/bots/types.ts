/**
 * A single signal from a scout bot (Reddit, X, Google Trends, etc.).
 */
export interface Signal {
  source: string;
  type: string;
  title: string;
  description: string;
  intensity: number;
  rawData?: unknown;
  sourceUrl?: string;
  detectedAt: Date;
}

/**
 * Scout bot contract: scan and return signals.
 */
export interface ScoutBot {
  name: string;
  scan(): Promise<Signal[]>;
}
