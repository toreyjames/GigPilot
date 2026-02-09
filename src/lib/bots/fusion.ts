import { getPrisma } from "@/lib/db";
import { computeEarningsPerHour } from "@/lib/roi";
import {
  synthesizeOpportunities,
  type SignalInput,
  type SynthesizedOpportunity,
} from "@/lib/ai";

const HOURS_BACK = 48;
const MIN_SIGNALS_PER_CLUSTER = 2;
const MIN_CONVERGENCE = 1;
const DEMAND_THRESHOLD = 40;
const OPPORTUNITY_MAX_AGE_DAYS = 14;

const KEYWORD_BUCKETS: Record<string, string[]> = {
  email: ["email", "sequence", "welcome", "newsletter", "automation", "drip"],
  pet: ["pet", "portrait", "dog", "cat", "illustration", "art"],
  social: ["social media", "instagram", "tiktok", "content", "post", "reels"],
  writing: ["copy", "copywriting", "blog", "content", "article", "seo"],
  design: ["logo", "design", "brand", "graphic", "canva"],
  tool: ["tool", "app", "software", "automation", "saas", "plugin"],
  freelance: [
    "freelance",
    "gig",
    "side hustle",
    "fiverr",
    "upwork",
    "contract",
  ],
  startup: [
    "startup",
    "yc",
    "side project",
    "indie",
    "launch",
    "product hunt",
  ],
};

/** Per-topic defaults used as fallback when LLM is unavailable */
const TOPIC_DEFAULTS: Record<
  string,
  { avgEarnings: string; timeToDeliver: string; competition: string }
> = {
  email: { avgEarnings: "$75", timeToDeliver: "~1-2 days", competition: "medium" },
  pet: { avgEarnings: "$35", timeToDeliver: "~10 min", competition: "low" },
  social: { avgEarnings: "$150/mo", timeToDeliver: "~2-4 hrs/mo", competition: "medium" },
  writing: { avgEarnings: "$50-100", timeToDeliver: "~1-2 days", competition: "medium" },
  design: { avgEarnings: "$50-150", timeToDeliver: "~1-3 days", competition: "medium" },
  tool: { avgEarnings: "$80-200", timeToDeliver: "~2-5 days", competition: "high" },
  freelance: { avgEarnings: "$40-80", timeToDeliver: "~1 day", competition: "medium" },
  startup: { avgEarnings: "$100-200", timeToDeliver: "~2-7 days", competition: "medium" },
  other: { avgEarnings: "$50-150", timeToDeliver: "~1-2 days", competition: "medium" },
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

/* ---------- LLM-powered opportunity creation ---------- */

async function createOpportunitiesFromLLM(
  synthesized: SynthesizedOpportunity[],
  demandScore: number,
  convergence: number,
  avgIntensity: number,
  sourceList: string,
  clusterKey: string,
  clusterSignals: { id: string }[],
  linkedSignalIds: Set<string>,
  prisma: NonNullable<ReturnType<typeof getPrisma>>
): Promise<{ created: number; linked: number }> {
  let created = 0;
  let linked = 0;

  for (let i = 0; i < synthesized.length; i++) {
    const s = synthesized[i];
    const earningsPerHour = computeEarningsPerHour(
      s.avgEarnings,
      s.timeToDeliver,
      s.competition,
      demandScore
    );
    const oppClusterKey = `${clusterKey}:${i}`;

    const opp = await prisma.opportunity.create({
      data: {
        title: s.title.slice(0, 120),
        category: s.category,
        description: s.description.slice(0, 500),
        avgEarnings: s.avgEarnings,
        timeToDeliver: s.timeToDeliver,
        demandScore,
        competition: s.competition,
        trend: s.trend,
        source: sourceList,
        isHot: s.isHot || demandScore >= 70,
        isActive: true,
        convergenceScore: convergence,
        painIntensity: avgIntensity,
        earningsPerHour,
        rawData: { clusterKey: oppClusterKey, llm: true },
      },
    });

    for (const sig of clusterSignals) {
      if (linkedSignalIds.has(sig.id)) continue;
      linkedSignalIds.add(sig.id);
      await prisma.signal.update({
        where: { id: sig.id },
        data: { opportunityId: opp.id },
      });
      linked++;
    }
    created++;
  }

  return { created, linked };
}

/* ---------- Fallback: keyword-bucket logic (no LLM) ---------- */

async function createOpportunityFallback(
  topic: string,
  cluster: {
    signals: { id: string; title: string; description: string }[];
    sources: Set<string>;
  },
  demandScore: number,
  convergence: number,
  avgIntensity: number,
  sourceList: string,
  clusterKey: string,
  linkedSignalIds: Set<string>,
  prisma: NonNullable<ReturnType<typeof getPrisma>>
): Promise<{ created: number; updated: number; linked: number }> {
  const defaults = TOPIC_DEFAULTS[topic] ?? TOPIC_DEFAULTS.other;
  const primaryTitle =
    cluster.signals[0]?.title?.slice(0, 80) ?? `Opportunity: ${topic}`;
  const category =
    topic.charAt(0).toUpperCase() + topic.slice(1).replace(/_/g, " ");
  const descParts = cluster.signals
    .slice(0, 3)
    .map((s) => (s.description?.trim() || s.title).slice(0, 200));
  const description =
    descParts.join(" ").replace(/\s+/g, " ").trim().slice(0, 500) ||
    `Signals from ${sourceList}.`;
  const earningsPerHour = computeEarningsPerHour(
    defaults.avgEarnings,
    defaults.timeToDeliver,
    defaults.competition,
    demandScore
  );

  let created = 0;
  let updated = 0;
  let linked = 0;

  const existing = await prisma.opportunity.findFirst({
    where: {
      isActive: true,
      rawData: { path: ["clusterKey"], equals: clusterKey },
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
        avgEarnings: defaults.avgEarnings,
        timeToDeliver: defaults.timeToDeliver,
        competition: defaults.competition,
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
      linked++;
    }
    updated++;
  } else {
    const opp = await prisma.opportunity.create({
      data: {
        title: primaryTitle,
        category,
        description,
        avgEarnings: defaults.avgEarnings,
        timeToDeliver: defaults.timeToDeliver,
        demandScore,
        competition: defaults.competition,
        trend: "rising",
        source: sourceList,
        isHot: demandScore >= 70,
        isActive: true,
        convergenceScore: convergence,
        painIntensity: avgIntensity,
        earningsPerHour,
        rawData: { clusterKey },
      },
    });
    for (const s of cluster.signals) {
      if (linkedSignalIds.has(s.id)) continue;
      linkedSignalIds.add(s.id);
      await prisma.signal.update({
        where: { id: s.id },
        data: { opportunityId: opp.id },
      });
      linked++;
    }
    created++;
  }

  return { created, updated, linked };
}

/* ---------- main fusion entry point ---------- */

export async function runFusion(): Promise<{
  opportunitiesCreated: number;
  opportunitiesUpdated: number;
  signalsLinked: number;
  llmUsed: boolean;
}> {
  const prisma = getPrisma();
  if (!prisma) {
    return {
      opportunitiesCreated: 0,
      opportunitiesUpdated: 0,
      signalsLinked: 0,
      llmUsed: false,
    };
  }

  // Deactivate opportunities older than OPPORTUNITY_MAX_AGE_DAYS so the feed rotates
  const expiryCutoff = new Date(
    Date.now() - OPPORTUNITY_MAX_AGE_DAYS * 24 * 60 * 60 * 1000
  );
  await prisma.opportunity.updateMany({
    where: { updatedAt: { lt: expiryCutoff }, isActive: true },
    data: { isActive: false },
  });

  const since = new Date(Date.now() - HOURS_BACK * 60 * 60 * 1000);
  const signals = await prisma.signal.findMany({
    where: { detectedAt: { gte: since }, opportunityId: null },
    orderBy: { detectedAt: "desc" },
  });

  const clusterMap = new Map<
    string,
    {
      signals: typeof signals;
      sources: Set<string>;
      totalIntensity: number;
    }
  >();

  for (const s of signals) {
    const topics = extractTopics(s.title, s.description);
    for (const topic of topics) {
      if (!clusterMap.has(topic)) {
        clusterMap.set(topic, {
          signals: [],
          sources: new Set(),
          totalIntensity: 0,
        });
      }
      const c = clusterMap.get(topic)!;
      c.signals.push(s);
      c.sources.add(s.source);
      c.totalIntensity += s.intensity;
    }
  }

  let opportunitiesCreated = 0;
  let opportunitiesUpdated = 0;
  let signalsLinked = 0;
  let llmUsed = false;
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
    const clusterKey = `${topic}|${[...cluster.signals.map((s) => s.id)].sort().join(",")}`;

    // Try LLM synthesis first
    const signalInputs: SignalInput[] = cluster.signals.slice(0, 10).map((s) => ({
      source: s.source,
      type: s.type,
      title: s.title,
      description: s.description,
      intensity: s.intensity,
      sourceUrl: s.sourceUrl ?? undefined,
    }));

    const synthesized = await synthesizeOpportunities(signalInputs, topic);

    if (synthesized.length > 0) {
      // LLM produced results -- create opportunities from them
      llmUsed = true;
      const result = await createOpportunitiesFromLLM(
        synthesized,
        demandScore,
        convergence,
        avgIntensity,
        sourceList,
        clusterKey,
        cluster.signals,
        linkedSignalIds,
        prisma
      );
      opportunitiesCreated += result.created;
      signalsLinked += result.linked;
    } else {
      // No LLM available or it failed -- use fallback keyword-bucket logic
      const result = await createOpportunityFallback(
        topic,
        cluster,
        demandScore,
        convergence,
        avgIntensity,
        sourceList,
        clusterKey,
        linkedSignalIds,
        prisma
      );
      opportunitiesCreated += result.created;
      opportunitiesUpdated += result.updated;
      signalsLinked += result.linked;
    }
  }

  return {
    opportunitiesCreated,
    opportunitiesUpdated,
    signalsLinked,
    llmUsed,
  };
}
