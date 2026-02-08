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
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Users,
  Clock,
  Sparkles,
  Lightbulb,
  Target,
  Zap,
  Bot,
} from "lucide-react";

export default function IdeaReportPage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [category, setCategory] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!user.isLoggedIn) {
      router.push("/signup?track=a");
      return;
    }
    setIdea(user.idea || "");
    setCategory(user.ideaCategory || "");
    setUserName(user.name || "");
  }, [router]);

  const handleContinue = () => {
    saveUser({ onboardingDone: true });
    router.push("/idea/plan");
  };

  // Generate a score based on the category (sample data - will be real bot data later)
  const score = 78;

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
            Intelligence Report
          </Badge>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <Link
          href="/idea"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Edit idea
        </Link>

        {/* Header */}
        <div>
          <Badge variant="secondary" className="mb-2">
            {category}
          </Badge>
          <h1 className="text-2xl font-bold lg:text-3xl">
            Intelligence Report
          </h1>
          <p className="mt-1 text-muted-foreground">
            {userName ? `${userName}, here's` : "Here's"} what our bots found
            about your idea.
          </p>
          <div className="mt-3 rounded-lg border border-border/50 bg-muted/30 p-3">
            <p className="text-sm italic text-muted-foreground">
              &ldquo;{idea}&rdquo;
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:gap-6">
              <div className="mb-4 sm:mb-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary bg-background">
                  <span className="text-2xl font-bold text-primary">
                    {score}
                  </span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Opportunity Score: {score}/100
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This idea has strong market signals. Demand is rising,
                  competition is manageable, and AI gives you a significant speed
                  advantage.
                </p>
                <Badge className="mt-2 gap-1 bg-primary text-primary-foreground">
                  <CheckCircle2 className="h-3 w-3" />
                  Recommended to pursue
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signal breakdown */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Demand",
              value: "High",
              detail: "Rising search interest and social mentions",
              icon: TrendingUp,
              score: 85,
            },
            {
              label: "Competition",
              value: "Moderate",
              detail: "Established players exist but gaps remain",
              icon: Users,
              score: 62,
            },
            {
              label: "AI Advantage",
              value: "Strong",
              detail: "AI can handle 80%+ of the execution",
              icon: Zap,
              score: 90,
            },
            {
              label: "Time to Revenue",
              value: "2-4 weeks",
              detail: "Fast path to first dollar",
              icon: Clock,
              score: 75,
            },
          ].map((signal) => (
            <Card key={signal.label} className="border-border/50">
              <CardContent className="p-4">
                <signal.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">{signal.label}</p>
                <p className="text-lg font-bold">{signal.value}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${signal.score}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {signal.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* What bots found */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">What the Bots Found</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  source: "Google Trends",
                  finding:
                    "Search interest for related terms is up 145% over the past 6 months. Breakout searches detected in 3 related keywords.",
                  type: "positive",
                },
                {
                  source: "Reddit",
                  finding:
                    '23 posts in the last 30 days from people asking for this exact service. Average upvotes: 89. Common phrase: "I wish someone would..."',
                  type: "positive",
                },
                {
                  source: "Fiverr / Upwork",
                  finding:
                    "142 active sellers, but average rating is only 4.1/5. Top sellers have 3-week backlogs. Price range: $25-150.",
                  type: "opportunity",
                },
                {
                  source: "TikTok",
                  finding:
                    "Related content has 8.2M views this month. Growing but not yet saturated. Early mover advantage available.",
                  type: "positive",
                },
              ].map((item) => (
                <div
                  key={item.source}
                  className="flex gap-3 rounded-lg border border-border/50 p-3"
                >
                  <div className="mt-0.5">
                    {item.type === "positive" ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.source}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.finding}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Differentiation tips */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">How to Stand Out</h2>
            </div>
            <div className="space-y-3">
              {[
                "Focus on speed - deliver in 24-48 hours vs. the 2-3 week average",
                "Offer multiple style variations to appeal to different tastes",
                "Bundle services (e.g., product + marketing materials) for higher ticket prices",
                "Target an underserved niche within this category for less competition",
              ].map((tip, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Earning estimate */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Earning Potential</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">Conservative</p>
                <p className="text-2xl font-bold text-primary">$500-1K</p>
                <p className="text-xs text-muted-foreground">/month</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">Realistic</p>
                <p className="text-2xl font-bold text-primary">$2-4K</p>
                <p className="text-xs text-muted-foreground">/month</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">Optimistic</p>
                <p className="text-2xl font-bold text-primary">$5-10K</p>
                <p className="text-xs text-muted-foreground">/month</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground text-center">
              Based on current market prices, demand signals, and 10-20 hrs/week
              commitment
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="gap-2 text-base" onClick={handleContinue}>
            <Sparkles className="h-4 w-4" />
            Build My Execution Plan
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
