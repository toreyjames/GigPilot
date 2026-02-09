import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * POST /api/bots/scan/trigger
 * Runs the scan using CRON_SECRET server-side (no secret in client).
 * Revalidates the opportunities cache so the dashboard shows fresh data.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 503 }
    );
  }

  const origin =
    req.nextUrl.origin ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const scanUrl = `${origin}/api/bots/scan`;

  try {
    const res = await fetch(scanUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Scan failed", status: res.status },
        { status: res.status }
      );
    }
    revalidateTag("opportunities", "max");
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: `Scan request failed: ${message}` },
      { status: 502 }
    );
  }
}
