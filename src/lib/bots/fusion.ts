import { getPrisma } from "@/lib/db";
import { computeEarningsPerHour } from "@/lib/roi";

const HOURS_BACK = 48;
const MIN_SIGNALS_PER_CLUSTER = 2;
const MIN_CONVERGENCE = 1;
const DEMAND_THRESHOLD = 40;

const KEYWORD_BUCKETS: Record<string, string[]> = {
  email: ["email", "sequence", "welcome", "newsletter", "automation", "drip"],
  pet: ["pet", "portrait", "dog", "cat", "illustration", "art"],
  social: ["social media", "instagram", "tiktok", "content", "post", "reels"],
  writing: ["copy", "copywriting", "blog", "content", "article", "seo"],
  design: ["logo", "design", "brand", "graphic", "canva"],
  tool: ["tool", "app", "software", "automation", "saas", "plugin"],
  freelance: ["freelance", "gig", "side hustle", "fiverr", "upwork", "contract"],
  startup: ["startup", "yc", "side project", "indie", "launch", "product hunt"],
};

function extractTopics(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const topics: string[] = [];
  for (const [topic, keywords] of Object.entries(KEYWORD_BUCKETS)) {
    if (keywords.some((k) => text.includes(k))) topics.push(topic);
  }
  if (topics.length === 0) topics.push("other");
  return topics;
}

export async function runFusion(): Promise<{
  opportunitiesCreated: number;
  opportunitiesUpdated: number;
  signalsLinked: number;
}> {
  const prisma = getPrisma();
  if (!prisma) {
    return { opportunitiesCreated: 0, opportunitiesUpdated: 0, signalsLinked: 0 };
  }

  const since = new Date(Date.now() - HOURS_BACK * 60 * 60 * 1000);
  const signals = await prisma.signal.findMany({
    where: { detectedAt: { gte: since }, opportunityId: null },
    orderBy: { detectedAt: "desc" },
  });

  const clusterMap = new Map<
    string,
    { signals: typeof signals; sources: Set<string>; totalIntensity: number }
  >();

  for (const s of signals) {
    const topics = extractTopics(s.title, s.description);
    for (const topic of topics) {
      const key = topic;
      if (!clusterMap.has(key)) {
        clusterMap.set(key, {
          signals: [],
          sources: new Set(),
          totalIntensity: 0,
        });
      }
      const c = clusterMap.get(key)!;
      c.signals.push(s);
      c.sources.add(s.source);
      c.totalIntensity += s.intensity;
    }
  }

  let opportunitiesCreated = 0;
  let opportunitiesUpdated = 0;
  let signalsLinked = 0;
  const linkedSignalIds = new Set<string>();

  for (const [topic, cluster] of clusterMap) {
    if (cluster.signals.length < MIN_SIGNALS_PER_CLUSTER) continue;

    const convergence = cluster.sources.size;
    if (convergence < MIN_CONVERGENCE) continue;

    const avgIntensity = Math.round(
      cluster.totalIntensity / cluster.signals.length
    );
    const demandScore = Math.min(
      100,
      Math.round(avgIntensity * 0.5 + convergence * 15)
    );
    if (demandScore < DEMAND_THRESHOLD) continue;

    const sourceList = [...cluster.sources].join(" + ");
    const titles = cluster.signals.map((s) => s.title);
    const primaryTitle =
      titles[0]?.slice(0, 80) ?? `Opportunity: ${topic}`;
    const category =
      topic.charAt(0).toUpperCase() + topic.slice(1).replace(/_/g, " ");
    const description =
      cluster.signals
        .slice(0, 3)
        .map((s) => s.title)
        .join(". ")
        .slice(0, 500) || `Signals from ${sourceList}.`;

    const avgEarnings = "$50–150";
    const timeToDeliver = "~1–2 days";
    const competition = "medium";
    const earningsPerHour = computeEarningsPerHour(
      avgEarnings,
      timeToDeliver,
      competition,
      demandScore
    );

    const existing = await prisma.opportunity.findFirst({
      where: {
        category: { equals: category, mode: "insensitive" },
        isActive: true,
      },
    });

    if (existing) {
      await prisma.opportunity.update({
        where: { id: existing.id },
        data: {
          demandScore,
          convergenceScore: convergence,
          painIntensity: avgIntensity,
          source: sourceList,
          description,
          earningsPerHour,
          updatedAt: new Date(),
        },
      });
      for (const s of cluster.signals) {
        if (linkedSignalIds.has(s.id)) continue;
        linkedSignalIds.add(s.id);
        await prisma.signal.update({
          where: { id: s.id },
          data: { opportunityId: existing.id },
        });
        signalsLinked++;
      }
      opportunitiesUpdated++;
    } else {
      const opp = await prisma.opportunity.create({
        data: {
          title: primaryTitle,
          category,
          description,
          avgEarnings,
          timeToDeliver,
          demandScore,
          competition: "medium",
          trend: "rising",
          source: sourceList,
          isHot: demandScore >= 70,
          isActive: true,
          convergenceScore: convergence,
          painIntensity: avgIntensity,
          earningsPerHour,
        },
      });
      for (const s of cluster.signals) {
        if (linkedSignalIds.has(s.id)) continue;
        linkedSignalIds.add(s.id);
        await prisma.signal.update({
          where: { id: s.id },
          data: { opportunityId: opp.id },
        });
        signalsLinked++;
      }
      opportunitiesCreated++;
    }
  }

  return {
    opportunitiesCreated,
    opportunitiesUpdated,
    signalsLinked,
  };
}
