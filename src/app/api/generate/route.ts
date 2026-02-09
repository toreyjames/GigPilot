import { NextRequest, NextResponse } from "next/server";
import { generateTemplateContent, getModelInfo } from "@/lib/ai";
import { getTemplateById } from "@/lib/data";
import { getPrisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const modelInfo = getModelInfo();
  if (!modelInfo.available) {
    return NextResponse.json(
      {
        error:
          "No AI provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.",
      },
      { status: 503 }
    );
  }

  let body: { templateId?: string; fields?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { templateId, fields } = body;
  if (!templateId || !fields || typeof fields !== "object") {
    return NextResponse.json(
      { error: "templateId and fields are required" },
      { status: 400 }
    );
  }

  const template = getTemplateById(templateId);
  if (!template) {
    return NextResponse.json(
      { error: `Template '${templateId}' not found` },
      { status: 404 }
    );
  }

  const content = await generateTemplateContent(
    template.title,
    template.longDescription || template.description,
    fields
  );

  if (!content) {
    return NextResponse.json(
      { error: "AI generation failed. Try again." },
      { status: 502 }
    );
  }

  // Save to Generation table if DB is available
  const prisma = getPrisma();
  if (prisma) {
    try {
      await prisma.generation.create({
        data: {
          userId: "anonymous", // No auth yet; placeholder
          template: templateId,
          inputs: fields,
          output: content,
          provider: modelInfo.provider,
          model: modelInfo.model,
          tokens: 0,
        },
      });
    } catch {
      // Non-critical; don't fail the request
    }
  }

  return NextResponse.json({
    content,
    provider: modelInfo.provider,
    model: modelInfo.model,
  });
}
