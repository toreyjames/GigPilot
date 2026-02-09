import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getPrisma } from "@/lib/db";
import {
  estimateMonthlyPotential,
  rankOpportunitiesByGoal,
} from "@/lib/roi";

function formatFoundAt(date: Date): string {
  const ms = Date.now() - new Date(date).getTime();
  const mins = Math.floor(ms / 60000);
  const hours = Math.floor(ms / 3600000);
  const days = Math.floor(ms / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

type MappedRow = ReturnType<typeof mapRow>;

async function getOpportunitiesFromDb(goal: number | null): Promise<{
  opportunities: MappedRow[];
  fromDb: boolean;
}> {
  try {
    const prisma = getPrisma();
    if (!prisma) {
      return { opportunities: [], fromDb: false };
    }
    const rows = await prisma.opportunity.findMany({
      where: { isActive: true },
      orderBy: [{ updatedAt: "desc" }, { demandScore: "desc" }],
      take: 50,
    });
    let opportunities = rows.map(mapRow);
    if (goal != null && goal > 0) {
      opportunities = rankOpportunitiesByGoal(
        opportunities,
        goal,
        estimateMonthlyPotential,
        (o) => o.demandScore
      );
    }
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

export async function GET(req: NextRequest) {
  const goalParam = req.nextUrl.searchParams.get("goal");
  const skillsParam = req.nextUrl.searchParams.get("skills") ?? "";
  const hoursParam = req.nextUrl.searchParams.get("hours") ?? "";
  const goal =
    goalParam != null && goalParam !== ""
      ? Math.max(0, Math.floor(Number(goalParam)))
      : null;
  const cacheKey = [
    CACHE_TAG,
    goal != null ? String(goal) : "none",
    skillsParam || "none",
    hoursParam || "none",
  ];
  const cached = await unstable_cache(
    () => getOpportunitiesFromDb(goal),
    cacheKey,
    { revalidate: CACHE_SECONDS, tags: [CACHE_TAG] }
  )();
  return NextResponse.json(cached);
}
