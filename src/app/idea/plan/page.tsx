"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, saveUser } from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Rocket,
  CheckCircle2,
  Zap,
  Target,
  Users,
  DollarSign,
} from "lucide-react";

const WEEKLY_PLAN = [
  {
    week: 1,
    title: "Validate & Set Up",
    tasks: [
      "Review your Intelligence Report and refine your niche",
      "Set up your seller account (Etsy, Fiverr, Amazon, etc.)",
      "Create your first 3 deliverables using AI templates",
      "Set your pricing based on market data",
    ],
    template: "product-description",
    milestone: "First 3 products/services ready to sell",
  },
  {
    week: 2,
    title: "Launch & List",
    tasks: [
      "List your products/services on your chosen platform",
      "Optimize listings with SEO keywords from bot intelligence",
      "Create a social media presence for your brand",
      "Generate a 7-day content calendar to promote your launch",
    ],
    template: "social-media-pack",
    milestone: "Live listings and first promotional content",
  },
  {
    week: 3,
    title: "Outreach & First Sales",
    tasks: [
      "Use the Client Outreach template to pitch 10 potential buyers",
      "Post in relevant communities (Reddit, Facebook Groups)",
      "Respond to any inquiries within 2 hours",
      "Deliver your first order and collect feedback",
    ],
    template: "email-sequence",
    milestone: "First paying customer",
  },
  {
    week: 4,
    title: "Optimize & Scale",
    tasks: [
      "Analyze what worked and what didn't",
      "Double down on your best-performing listing or channel",
      "Create 5 more products/deliverables",
      "Set up a system for recurring clients or repeat sales",
    ],
    template: "blog-post",
    milestone: "Repeatable process established",
  },
];

export default function IdeaPlanPage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!user.isLoggedIn) {
      router.push("/signup?track=a");
      return;
    }
    setIdea(user.idea || "");
    setUserName(user.name || "");
  }, [router]);

  const handleLaunch = () => {
    saveUser({ onboardingDone: true });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">GigPilot</span>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Lightbulb className="h-3 w-3 text-primary" />
            Execution Plan
          </Badge>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        <Link
          href="/idea/report"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to report
        </Link>

        {/* Header */}
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 gap-1">
            <Target className="h-3 w-3 text-primary" />
            Your 4-week plan
          </Badge>
          <h1 className="text-2xl font-bold lg:text-3xl">
            {userName ? `${userName}, here's` : "Here's"} your plan to turn this
            idea into <span className="text-primary">real income</span>
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Follow this week-by-week plan. Each step links to the AI templates
            you need. Your bots will keep scanning for new intelligence along the
            way.
          </p>
        </div>

        {/* Weekly plan */}
        <div className="space-y-4">
          {WEEKLY_PLAN.map((week) => (
            <Card key={week.week} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {week.week}
                      </span>
                      <h3 className="text-lg font-semibold">
                        Week {week.week}: {week.title}
                      </h3>
                    </div>
                  </div>
                  <Link href={`/dashboard/templates/${week.template}`}>
                    <Badge
                      variant="secondary"
                      className="gap-1 border-primary/20 text-primary cursor-pointer hover:bg-primary/10"
                    >
                      <Zap className="h-3 w-3" />
                      Use Template
                    </Badge>
                  </Link>
                </div>

                <ul className="space-y-2 mb-4">
                  {week.tasks.map((task) => (
                    <li
                      key={task}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                      {task}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/10 p-2.5">
                  <Target className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-xs">
                    <strong>Milestone:</strong>{" "}
                    <span className="text-muted-foreground">
                      {week.milestone}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              <div className="text-center">
                <DollarSign className="mx-auto h-6 w-6 text-primary mb-1" />
                <p className="text-2xl font-bold">$2-4K</p>
                <p className="text-xs text-muted-foreground">
                  Target monthly income
                </p>
              </div>
              <div className="text-center">
                <Users className="mx-auto h-6 w-6 text-primary mb-1" />
                <p className="text-2xl font-bold">3-5</p>
                <p className="text-xs text-muted-foreground">
                  Clients or sales channels
                </p>
              </div>
              <div className="text-center">
                <Rocket className="mx-auto h-6 w-6 text-primary mb-1" />
                <p className="text-2xl font-bold">4 weeks</p>
                <p className="text-xs text-muted-foreground">
                  To first revenue
                </p>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="gap-2 text-base"
                onClick={handleLaunch}
              >
                <Rocket className="h-4 w-4" />
                Let&apos;s Build This
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                You&apos;ll land on your dashboard with templates and bot
                intelligence ready
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
