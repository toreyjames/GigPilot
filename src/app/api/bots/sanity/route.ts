import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { hackerNewsBot } from "@/lib/bots/hackernews";

/**
 * Lightweight sanity check: DB connectivity, opportunities count, and a single-bot
 * probe (HN, no API key) to verify the pipeline. No auth so you can run it easily
 * in dev or behind a firewall. For production you may want to protect this route.
 */
export async function GET() {
  const start = Date.now();
  const report: {
    ok: boolean;
    dbOk: boolean;
    opportunitiesCount: number;
    probe: { bot: string; count: number; durationMs: number; error?: string };
    totalDurationMs: number;
    message: string;
  } = {
    ok: false,
    dbOk: false,
    opportunitiesCount: 0,
    probe: { bot: hackerNewsBot.name, count: 0, durationMs: 0 },
    totalDurationMs: 0,
    message: "",
  };

  const prisma = getPrisma();
  if (prisma) {
    report.dbOk = true;
    try {
      report.opportunitiesCount = await prisma.opportunity.count({
        where: { isActive: true },
      });
    } catch {
      report.dbOk = false;
      report.message = "DB connection or query failed.";
      report.totalDurationMs = Date.now() - start;
      return NextResponse.json(report);
    }
  } else {
    report.message = "No DATABASE_URL; DB unavailable.";
  }

  const probeStart = Date.now();
  try {
    const signals = await hackerNewsBot.scan();
    report.probe.durationMs = Date.now() - probeStart;
    report.probe.count = signals.length;
  } catch (e) {
    report.probe.durationMs = Date.now() - probeStart;
    report.probe.error = e instanceof Error ? e.message : String(e);
  }

  report.totalDurationMs = Date.now() - start;
  report.ok = report.dbOk && report.probe.error === undefined;
  if (!report.message) {
    report.message = report.ok
      ? "DB and pipeline probe OK."
      : report.probe.error
        ? `Probe failed: ${report.probe.error}`
        : "Check dbOk and probe.";
  }

  return NextResponse.json(report);
}
