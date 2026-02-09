"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTemplateById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Clock,
  Sparkles,
  Copy,
  Download,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function TemplateExecutionPage() {
  const { id } = useParams<{ id: string }>();
  const template = getTemplateById(id);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!template) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        <h1 className="text-2xl font-bold">Template Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          This template doesn&apos;t exist yet.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/templates">Browse Templates</Link>
        </Button>
      </div>
    );
  }

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: id, fields: formData }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Fallback to sample output if AI is unavailable
        setGeneratedContent(getSampleOutput(id));
        setGenerateError(data.error || "AI generation failed. Showing sample output.");
      } else {
        setGeneratedContent(data.content);
      }
      setGenerated(true);
    } catch {
      setGeneratedContent(getSampleOutput(id));
      setGenerateError("Network error. Showing sample output.");
      setGenerated(true);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent || getSampleOutput(id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allRequiredFilled = template.fields
    .filter((f) => f.required)
    .every((f) => formData[f.id]?.trim());

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/templates"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Templates
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{template.category}</Badge>
          <div className="flex items-center gap-1.5 text-sm">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{template.avgEarnings}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {template.timeToComplete}
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold">{template.title}</h1>
        <p className="mt-1 text-muted-foreground">
          {template.longDescription}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input form */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold">Fill in the Details</h2>
            <div className="space-y-4">
              {template.fields.map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && (
                      <span className="ml-1 text-destructive">*</span>
                    )}
                  </Label>
                  {field.type === "text" && (
                    <Input
                      id={field.id}
                      placeholder={field.placeholder}
                      className="mt-1.5"
                      value={formData[field.id] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.id]: e.target.value })
                      }
                    />
                  )}
                  {field.type === "textarea" && (
                    <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      className="mt-1.5 min-h-[100px]"
                      value={formData[field.id] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.id]: e.target.value })
                      }
                    />
                  )}
                  {field.type === "select" && field.options && (
                    <Select
                      value={formData[field.id] || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, [field.id]: value })
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}

              <Button
                className="w-full gap-2 mt-2"
                size="lg"
                onClick={handleGenerate}
                disabled={generating || !allRequiredFilled}
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>
              {!allRequiredFilled && !generating && (
                <p className="text-xs text-muted-foreground text-center">
                  Fill in all required fields to generate
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Generated Output</h2>
              {generated && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-3.5 w-3.5" />
                    Export
                  </Button>
                </div>
              )}
            </div>

            {!generated && !generating && (
              <div className="flex h-80 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
                <div className="text-center px-6">
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Ready to generate</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Fill in the form on the left and click &quot;Generate with
                    AI&quot; to create your deliverable
                  </p>
                </div>
              </div>
            )}

            {generating && (
              <div className="flex h-80 items-center justify-center rounded-lg border border-dashed border-primary/20 bg-primary/5">
                <div className="text-center">
                  <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">AI is working...</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Generating your {template.title.toLowerCase()} using
                    GPT-4o + Claude
                  </p>
                </div>
              </div>
            )}

            {generated && (
              <div className="space-y-4">
                {generateError && (
                  <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3 text-xs text-yellow-600 dark:text-yellow-400">
                    {generateError}
                  </div>
                )}
                <div className="rounded-lg bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {generatedContent || getSampleOutput(template.id)}
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Ready to deliver!</strong>{" "}
                    Review the output, make any edits, then copy or export to
                    send to your client.
                  </p>
                </div>
                <Button className="w-full gap-2" asChild>
                  <Link href={`/dashboard/templates/${id}/delivery`}>
                    <ArrowRight className="h-4 w-4" />
                    How to Sell This & Get Paid
                  </Link>
                </Button>
                <Button variant="outline" className="w-full gap-2" asChild>
                  <Link href="/dashboard/earnings">
                    <DollarSign className="h-4 w-4" />
                    Log This Earning
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getSampleOutput(templateId: string): string {
  const outputs: Record<string, string> = {
    "email-sequence": `Subject: Welcome to [Business Name]! Here's what happens next...

---

EMAIL 1: THE WARM WELCOME (Send immediately)

Subject Line: Welcome to the family! Here's a little something for you
Preview Text: Plus, what to expect from us...

Hi [First Name],

We're thrilled you're here! Welcome to [Business Name].

We started [Business Name] because [brief origin story aligned with customer values]. Every product we make is designed to [core value proposition].

As a thank-you for joining, here's 10% off your first order: WELCOME10

What to expect from us:
- New product drops and early access
- Tips and inspiration for [relevant lifestyle topic]
- Exclusive offers just for subscribers

Talk soon,
[Founder Name]
[Business Name]

---

EMAIL 2: THE VALUE ADD (Send Day 2)

Subject Line: The #1 mistake people make with [product category]
Preview Text: (and how to avoid it)

...

[Continues for 5 emails total with send timing, A/B subject line variants, and personalization notes]`,

    "blog-post": `# 10 Best Email Marketing Tools for Small Business in 2026

**Meta Description:** Discover the 10 best email marketing tools for small business in 2026. Compare features, pricing, and ease of use to find the perfect platform for your needs.

**Target Keyword:** email marketing tools

---

## Introduction

Email marketing remains the highest-ROI marketing channel for small businesses, delivering an average of $42 for every $1 spent. But with dozens of platforms to choose from, finding the right tool can feel overwhelming...

## 1. Mailchimp - Best for Beginners

Mailchimp has long been the go-to for small businesses just getting started with email marketing...

**Key Features:**
- Free plan for up to 500 contacts
- Drag-and-drop email builder
- Basic automation workflows
- Built-in landing pages

**Pricing:** Free - $350/month

## 2. ConvertKit - Best for Creators

...

[Continues for all 10 tools with detailed sections, comparison table, and conclusion with CTA]`,

    "product-description": `PRODUCT TITLE:
Premium Organic Bamboo Cutting Board Set - 3-Piece Kitchen Chopping Boards with Juice Groove | Eco-Friendly, BPA-Free, Dishwasher Safe | Perfect for Meat, Vegetables, Cheese & Bread

BULLET POINTS:
• COMPLETE 3-PIECE SET - Includes Large (18"x12"), Medium (14"x10"), and Small (11"x8") cutting boards to handle every kitchen task from carving a roast to slicing herbs
• 100% ORGANIC BAMBOO - Sustainably harvested Moso bamboo that's 16% harder than maple, naturally antimicrobial, and won't dull your knives
• BUILT-IN JUICE GROOVE - Deep perimeter channel catches liquids from meats and fruits, keeping your countertop clean and mess-free
• NON-SLIP SILICONE GRIP - Four corner grips keep the board firmly in place during use, providing extra safety and stability while chopping
• EASY CARE & CLEANUP - Dishwasher safe construction makes cleanup effortless. Also hand-wash friendly with warm soap and water

PRODUCT DESCRIPTION:
Transform your kitchen prep with our Premium Organic Bamboo Cutting Board Set...

[Continues with full A+ content, backend keywords list]`,

    "social-media-pack": `30-DAY SOCIAL MEDIA CONTENT CALENDAR

📅 WEEK 1: Brand Introduction & Engagement

DAY 1 (Monday) - INTRODUCTION POST
Caption: "Every great meal starts with a story. Ours began 15 years ago in a tiny kitchen with Nonna's recipe book and a dream. Welcome to [Business Name] — where every dish is made with love and the freshest ingredients. 🍝"
Hashtags: #ItalianFood #LocalEats #FamilyOwned #FreshIngredients #SupportLocal
Best time to post: 11:30 AM
Image prompt: Warm photo of the restaurant interior with soft lighting, focusing on an inviting table setup

DAY 2 (Tuesday) - BEHIND THE SCENES
Caption: "Taco Tuesday? We see your tacos and raise you fresh-made pappardelle. 😏 Watch our chef hand-roll pasta this morning — yes, we do this every single day."
Hashtags: #BehindTheScenes #FreshPasta #HandmadePasta #ChefLife
Best time to post: 12:00 PM
Image prompt: Short video of chef making fresh pasta by hand

...

[Continues for 30 days with mix of promotional, educational, engagement, and UGC posts]`,

    "video-script": `TITLE: 7 Money Habits That Keep You Poor (Most People Do #4 Daily)

THUMBNAIL CONCEPT: Split image - left side shows person stressed with empty wallet (red tint), right side shows confident person with cash (green tint). Bold text: "STOP DOING #4" in yellow.

DESCRIPTION: Most people work hard but never get ahead financially. In this video, we break down the 7 money habits that are secretly keeping you poor — and what to do instead. Habit #4 is something 83% of Americans do every single day without realizing it's costing them thousands...

TAGS: money habits, personal finance, financial freedom, stop being poor, money mistakes, wealth building, financial literacy

---

SCRIPT:

[HOOK - 0:00-0:30]
Right now, there's a good chance you're doing something with your money that's actively making you poorer. Not by a little — by thousands of dollars a year. And the worst part? Nobody ever told you.

Today we're breaking down 7 money habits that keep people poor. And before you think "I already know this stuff" — habit number 4 catches 83% of Americans, including people who think they're good with money.

[MAIN CONTENT]

HABIT 1: Lifestyle Inflation [0:30-2:00]
...

[Continues for full 10-minute script with timestamps, engagement prompts, and CTA]`,

    "resume-rewrite": `[PROFESSIONAL RESUME]

JANE DOE
Senior Product Manager

San Francisco, CA | jane.doe@email.com | linkedin.com/in/janedoe

PROFESSIONAL SUMMARY
Results-driven Product Manager with 8+ years of experience shipping B2B SaaS products that drive measurable business outcomes. Led cross-functional teams of 15+ to deliver products generating $12M+ ARR. Specialized in data-driven product strategy, user research, and agile development methodologies.

EXPERIENCE

Senior Product Manager | TechCorp Inc. | 2022 - Present
• Spearheaded product roadmap for enterprise analytics platform, increasing user adoption by 47% and driving $4.2M in new ARR within 12 months
• Led cross-functional team of 15 (engineering, design, data science) to deliver 3 major product launches on time and under budget
• Implemented data-driven prioritization framework that reduced feature cycle time by 35% while increasing customer satisfaction scores from 7.2 to 8.9

...

[Continues with full resume, skills section, and matching cover letter]`,
  };

  return outputs[templateId] || "Generated content will appear here...";
}
