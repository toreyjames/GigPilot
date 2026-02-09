import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getPrisma } from "@/lib/db";

function formatFoundAt(date: Date): string {
  const ms = Date.now() - new Date(date).getTime();
  const mins = Math.floor(ms / 60000);
  const hours = Math.floor(ms / 3600000);
  const days = Math.floor(ms / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

async function getOpportunitiesFromDb(): Promise<{
  opportunities: ReturnType<typeof mapRow>[];
  fromDb: boolean;
}> {
  try {
    const prisma = getPrisma();
    if (!prisma) {
      return { opportunities: [], fromDb: false };
    }
    const rows = await prisma.opportunity.findMany({
      where: { isActive: true },
      orderBy: [{ demandScore: "desc" }, { createdAt: "desc" }],
      take: 50,
    });
    const opportunities = rows.map(mapRow);
    return { opportunities, fromDb: true };
  } catch {
    return { opportunities: [], fromDb: false };
  }
}

function mapRow(r: {
  id: string;
  title: string;
  category: string;
  description: string;
  avgEarnings: string;
  timeToDeliver: string;
  demandScore: number;
  competition: string;
  trend: string;
  source: string;
  isHot: boolean;
  createdAt: Date;
  templateId: string | null;
  convergenceScore: number | null;
  painIntensity: number | null;
  earningsPerHour: number | null;
}) {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    description: r.description,
    avgEarnings: r.avgEarnings,
    timeToDeliver: r.timeToDeliver,
    demandScore: r.demandScore,
    competition: r.competition,
    trend: r.trend,
    source: r.source,
    isHot: r.isHot,
    foundAt: formatFoundAt(r.createdAt),
    templateId: r.templateId ?? "email-sequence",
    convergenceScore: r.convergenceScore,
    painIntensity: r.painIntensity,
    earningsPerHour: r.earningsPerHour ?? undefined,
  };
}

// Cache for 60s so dashboard and repeat navigations feel fast
const CACHE_TAG = "opportunities";
const CACHE_SECONDS = 60;

export async function GET() {
  const cached = await unstable_cache(
    getOpportunitiesFromDb,
    [CACHE_TAG],
    { revalidate: CACHE_SECONDS, tags: [CACHE_TAG] }
  )();
  return NextResponse.json(cached);
}
