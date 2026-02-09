import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

/* ---------- types ---------- */

export interface SignalInput {
  source: string;
  type: string;
  title: string;
  description: string;
  intensity: number;
  sourceUrl?: string;
}

export interface UserContext {
  earningsGoal?: number;
  skills?: string[];
  availableHours?: number;
}

const opportunitySchema = z.object({
  title: z
    .string()
    .describe(
      "A specific, catchy title for the gig opportunity (not a generic category)"
    ),
  description: z
    .string()
    .describe(
      "2-3 sentences of specific intel explaining why this is a real opportunity right now, citing the signal data"
    ),
  category: z.string().describe("Short category label, e.g. 'Email Marketing', 'SaaS Tool', 'Content Writing'"),
  avgEarnings: z
    .string()
    .describe("Estimated earnings per gig, e.g. '$75', '$100-200', '$150/mo'"),
  timeToDeliver: z
    .string()
    .describe("Estimated time, e.g. '~20 min', '~1-2 days', '~4 hrs'"),
  competition: z
    .enum(["low", "medium", "high"])
    .describe("Competition level based on signal analysis"),
  trend: z
    .enum(["rising", "stable", "falling"])
    .describe("Demand trend based on signal analysis"),
  isHot: z.boolean().describe("True if this is an urgent/high-demand opportunity"),
});

const synthesisSchema = z.object({
  opportunities: z
    .array(opportunitySchema)
    .min(1)
    .max(3)
    .describe("1-3 specific, actionable gig opportunity ideas"),
});

export type SynthesizedOpportunity = z.infer<typeof opportunitySchema>;

/* ---------- model selection ---------- */

function getModel() {
  if (process.env.OPENAI_API_KEY) {
    return openai("gpt-4o-mini");
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic("claude-3-5-haiku-latest");
  }
  return null;
}

/* ---------- synthesis ---------- */

export async function synthesizeOpportunities(
  signals: SignalInput[],
  topic: string,
  userContext?: UserContext
): Promise<SynthesizedOpportunity[]> {
  const model = getModel();
  if (!model) return [];

  const signalBlock = signals
    .slice(0, 10)
    .map(
      (s, i) =>
        `${i + 1}. [${s.source}] "${s.title}"${s.description ? ` — ${s.description.slice(0, 200)}` : ""}${s.sourceUrl ? ` (${s.sourceUrl})` : ""} (intensity: ${s.intensity}/100)`
    )
    .join("\n");

  let userBlock = "";
  if (userContext) {
    const parts: string[] = [];
    if (userContext.earningsGoal)
      parts.push(`wants to earn $${userContext.earningsGoal}/month`);
    if (userContext.availableHours)
      parts.push(`has ${userContext.availableHours} hours/week available`);
    if (userContext.skills?.length)
      parts.push(`skills: ${userContext.skills.join(", ")}`);
    if (parts.length)
      userBlock = `\n\nUser profile: ${parts.join("; ")}. Tailor the opportunities to this profile.`;
  }

  const prompt = `You are a gig economy analyst. Below are real signals detected by bots scanning Reddit, Hacker News, X/Twitter, Product Hunt, and Google Trends in the "${topic}" space.

SIGNALS:
${signalBlock}

Based on these signals, generate 1-3 SPECIFIC and ACTIONABLE freelance/side-hustle opportunity ideas that someone could start earning from this week.

Requirements:
- Each opportunity must be SPECIFIC — not a generic category like "Email Marketing" but a concrete gig like "Welcome email sequences for DTC Shopify stores launching Q1 sales"
- Reference the actual signal data in descriptions (mention specific trends, numbers, platforms)
- Price estimates should be realistic for the opportunity scope
- Each opportunity should be DIFFERENT from the others — different angles, different price points, different time commitments
- Do NOT produce generic filler. Every opportunity must be justified by the signals.${userBlock}`;

  try {
    const result = await generateObject({
      model,
      schema: synthesisSchema,
      prompt,
    });
    return result.object.opportunities;
  } catch (e) {
    console.error("[ai] synthesizeOpportunities failed:", e);
    return [];
  }
}

/* ---------- template generation ---------- */

export async function generateTemplateContent(
  templateTitle: string,
  templateDescription: string,
  fields: Record<string, string>
): Promise<string | null> {
  const model = getModel();
  if (!model) return null;

  const fieldBlock = Object.entries(fields)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  const prompt = `You are an expert freelancer and content creator. Generate high-quality deliverable content for the following template.

TEMPLATE: ${templateTitle}
DESCRIPTION: ${templateDescription}

USER INPUTS:
${fieldBlock}

Generate professional, ready-to-use content that the user can deliver to their client. Be specific, creative, and practical. Format the output with clear sections and headings using markdown.`;

  try {
    const result = await generateObject({
      model,
      schema: z.object({
        content: z
          .string()
          .describe("The full generated content in markdown format"),
        tokensUsed: z.number().optional(),
      }),
      prompt,
    });
    return result.object.content;
  } catch (e) {
    console.error("[ai] generateTemplateContent failed:", e);
    return null;
  }
}

/* ---------- export model info ---------- */

export function getModelInfo(): {
  provider: string;
  model: string;
  available: boolean;
} {
  if (process.env.OPENAI_API_KEY) {
    return { provider: "openai", model: "gpt-4o-mini", available: true };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      provider: "anthropic",
      model: "claude-3-5-haiku-latest",
      available: true,
    };
  }
  return { provider: "none", model: "none", available: false };
}
