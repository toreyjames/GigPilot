"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getTemplateById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  ExternalLink,
  CheckCircle2,
  Copy,
  Users,
  Globe,
  Mail,
  MessageSquare,
} from "lucide-react";

const DELIVERY_CHANNELS = [
  {
    name: "Fiverr",
    icon: Globe,
    description: "List as a gig. Set competitive pricing based on bot intelligence.",
    action: "Create a Fiverr gig",
    url: "https://www.fiverr.com/start_selling",
    tips: [
      "Use the opportunity keywords in your gig title",
      "Price 10-15% below the category average to get first reviews",
      "Offer 3 packages (basic, standard, premium)",
    ],
  },
  {
    name: "Upwork",
    icon: Globe,
    description: "Apply to active job posts. Your deliverable is your portfolio piece.",
    action: "Browse matching jobs",
    url: "https://www.upwork.com/nx/find-work/",
    tips: [
      "Attach your generated deliverable as a sample",
      "Reference specific pain points from the opportunity",
      "Propose a fixed price, not hourly",
    ],
  },
  {
    name: "Cold Outreach",
    icon: Mail,
    description: "Email businesses directly. Higher effort, higher reward.",
    action: "Use pitch template",
    tips: [
      "Find 10 businesses in the target niche",
      "Personalize the first line of each email",
      "Offer a free sample to get your foot in the door",
      "Follow up after 3 days if no response",
    ],
  },
  {
    name: "Reddit / Communities",
    icon: MessageSquare,
    description: "Share value in relevant communities. Don't sell - help.",
    action: "Find communities",
    tips: [
      "Post helpful content, not ads",
      "Answer questions related to your service",
      'Include "DM me if you need help with this" at the end',
      "Build reputation before pitching",
    ],
  },
];

const PITCH_TEMPLATE = `Subject: Quick question about your [business type]

Hi [Name],

I noticed [specific observation about their business - e.g., "your Shopify store doesn't have a welcome email sequence"].

I help [business type] businesses [solve specific problem] using AI-powered tools. The result is [specific deliverable] that typically [benefit - e.g., "increases email open rates by 40%"].

I'd love to show you a quick sample I put together. Would you be open to taking a look?

Best,
[Your name]

P.S. I can turn this around in 24 hours if you're interested.`;

export default function DeliveryGuidePage() {
  const { id } = useParams<{ id: string }>();
  const template = getTemplateById(id);

  if (!template) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        <h1 className="text-2xl font-bold">Template Not Found</h1>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/templates">Browse Templates</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href={`/dashboard/templates/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to template
      </Link>

      {/* Header */}
      <div>
        <Badge variant="secondary" className="mb-2 gap-1">
          <DollarSign className="h-3 w-3 text-primary" />
          Delivery Guide
        </Badge>
        <h1 className="text-2xl font-bold">
          Now sell it and get paid
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your {template.title.toLowerCase()} is ready. Here&apos;s exactly how to
          find buyers and deliver.
        </p>
      </div>

      {/* Pricing advice */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Pricing Guide</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-background p-3 text-center">
              <p className="text-xs text-muted-foreground">Starter Price</p>
              <p className="text-xl font-bold text-primary">
                {template.avgEarnings.split("-")[0]}
              </p>
              <p className="text-xs text-muted-foreground">
                To get first reviews
              </p>
            </div>
            <div className="rounded-lg bg-background p-3 text-center border border-primary/20">
              <p className="text-xs text-muted-foreground">Market Rate</p>
              <p className="text-xl font-bold text-primary">
                {template.avgEarnings}
              </p>
              <p className="text-xs text-muted-foreground">
                Based on bot intelligence
              </p>
            </div>
            <div className="rounded-lg bg-background p-3 text-center">
              <p className="text-xs text-muted-foreground">Premium</p>
              <p className="text-xl font-bold text-primary">
                ${parseInt(template.avgEarnings.replace(/[^0-9]/g, "")) * 2}+
              </p>
              <p className="text-xs text-muted-foreground">
                With rush delivery / extras
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery channels */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Where to Sell</h2>
        <div className="space-y-4">
          {DELIVERY_CHANNELS.map((channel) => (
            <Card key={channel.name} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <channel.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {channel.description}
                      </p>
                    </div>
                  </div>
                  {channel.url ? (
                    <Button variant="outline" size="sm" className="gap-1 shrink-0" asChild>
                      <a
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {channel.action}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="shrink-0">
                      {channel.action}
                    </Button>
                  )}
                </div>
                <ul className="space-y-1.5 pl-13">
                  {channel.tips.map((tip) => (
                    <li
                      key={tip}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pitch template */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Cold Outreach Pitch Template</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => navigator.clipboard.writeText(PITCH_TEMPLATE)}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
          <div className="rounded-lg bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {PITCH_TEMPLATE}
          </div>
        </CardContent>
      </Card>

      {/* Next steps */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Your Checklist</h2>
          </div>
          <div className="space-y-2">
            {[
              "Pick one delivery channel to start with (don't try all at once)",
              "Set your starter price 10-15% below market to get first reviews/clients",
              "Reach out to 10 potential buyers this week",
              "Deliver your first order within 24 hours of receiving it",
              "Ask for a review/testimonial after delivery",
              "Log your earnings in GigPilot to track progress",
            ].map((step, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
        <Button className="gap-2" asChild>
          <Link href="/dashboard/earnings">
            <DollarSign className="h-4 w-4" />
            Log My Earnings
          </Link>
        </Button>
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/dashboard">
            <ArrowRight className="h-4 w-4" />
            Back to Opportunities
          </Link>
        </Button>
      </div>
    </div>
  );
}
