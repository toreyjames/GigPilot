import { NextRequest, NextResponse } from "next/server";
import { bots } from "@/lib/bots/registry";
import { runFusion } from "@/lib/bots/fusion";
import { getPrisma } from "@/lib/db";
import type { Signal } from "@/lib/bots/types";

function authCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7) === secret;
  const key = req.nextUrl.searchParams.get("key");
  return key === secret;
}

async function persistSignals(signals: Signal[]): Promise<number> {
  const prisma = getPrisma();
  if (!prisma) return 0;
  let stored = 0;

  for (const s of signals) {
    const existing = await prisma.signal.findFirst({
      where: {
        source: s.source,
        ...(s.sourceUrl
          ? { sourceUrl: s.sourceUrl }
          : { sourceUrl: null }),
        detectedAt: {
          gte: new Date(s.detectedAt.getTime() - 24 * 60 * 60 * 1000),
          lte: new Date(s.detectedAt.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });
    if (existing) continue;
    await prisma.signal.create({
      data: {
        source: s.source,
        type: s.type,
        title: s.title,
        description: s.description,
        intensity: s.intensity,
        rawData: s.rawData ?? undefined,
        sourceUrl: s.sourceUrl ?? null,
        detectedAt: s.detectedAt,
      },
    });
    stored++;
  }
  return stored;
}

export async function GET(req: NextRequest) {
  if (!authCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runScan();
}

export async function POST(req: NextRequest) {
  if (!authCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runScan();
}

async function runScan() {
  const results: { bot: string; count: number; durationMs: number; error?: string }[] = [];
  let totalStored = 0;

  for (const bot of bots) {
    const start = Date.now();
    try {
      const signals = await bot.scan();
      const durationMs = Date.now() - start;
      results.push({ bot: bot.name, count: signals.length, durationMs });
      totalStored += await persistSignals(signals);
    } catch (e) {
      const durationMs = Date.now() - start;
      const error = e instanceof Error ? e.message : String(e);
      results.push({ bot: bot.name, count: 0, durationMs, error });
    }
  }

  const fusionStart = Date.now();
  const fusion = await runFusion();
  const fusionDurationMs = Date.now() - fusionStart;

  return NextResponse.json({
    signalsByBot: results,
    signalsStored: totalStored,
    fusion: {
      opportunitiesCreated: fusion.opportunitiesCreated,
      opportunitiesUpdated: fusion.opportunitiesUpdated,
      signalsLinked: fusion.signalsLinked,
      durationMs: fusionDurationMs,
    },
    totalDurationMs: results.reduce((s, r) => s + r.durationMs, 0) + fusionDurationMs,
  });
}
