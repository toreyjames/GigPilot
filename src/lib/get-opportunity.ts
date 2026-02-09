import { getPrisma } from "@/lib/db";
import { getOpportunityById as getStaticById } from "@/lib/data";
import type { Opportunity } from "@/lib/data";
import { computeEarningsPerHour } from "@/lib/roi";

function formatFoundAt(date: Date): string {
  const ms = Date.now() - new Date(date).getTime();
  const mins = Math.floor(ms / 60000);
  const hours = Math.floor(ms / 3600000);
  const days = Math.floor(ms / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * Resolve opportunity by id: from DB if available, otherwise from static data.
 */
export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  const prisma = getPrisma();
  if (prisma) {
    const r = await prisma.opportunity.findUnique({
      where: { id, isActive: true },
    });
    if (r) {
      return {
        id: r.id,
        title: r.title,
        category: r.category,
        description: r.description,
        avgEarnings: r.avgEarnings,
        timeToDeliver: r.timeToDeliver,
        demandScore: r.demandScore,
        competition: r.competition as "low" | "medium" | "high",
        trend: r.trend as "rising" | "stable" | "falling",
        source: r.source,
        isHot: r.isHot,
        foundAt: formatFoundAt(r.createdAt),
        detail: r.description,
        templateId: r.templateId ?? "email-sequence",
        tips: [],
        earningsPerHour: r.earningsPerHour ?? undefined,
      };
    }
  }
  const staticOpp = getStaticById(id) ?? null;
  if (!staticOpp) return null;
  return {
    ...staticOpp,
    earningsPerHour:
      staticOpp.earningsPerHour ??
      computeEarningsPerHour(
        staticOpp.avgEarnings,
        staticOpp.timeToDeliver,
        staticOpp.competition,
        staticOpp.demandScore
      ),
  };
}
