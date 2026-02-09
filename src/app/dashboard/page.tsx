"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { opportunities as staticOpportunities } from "@/lib/data";
import type { Opportunity } from "@/lib/data";
import {
  computeEarningsPerHour,
  estimateMonthlyPotential,
  rankOpportunitiesByGoal,
} from "@/lib/roi";
import { getUser } from "@/lib/user-store";
import type { UserTrack } from "@/lib/user-store";
import { OpportunityCard } from "@/components/dashboard/opportunity-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Radar,
  TrendingUp,
  DollarSign,
  Target,
  ArrowRight,
  Sparkles,
  Clock,
  Flame,
  SkipForward,
  CheckCircle2,
} from "lucide-react";

function mapApiToOpportunity(api: {
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
  foundAt: string;
  templateId?: string;
  earningsPerHour?: number;
}): Opportunity {
  return {
    ...api,
    competition: api.competition as "low" | "medium" | "high",
    trend: api.trend as "rising" | "stable" | "falling",
    detail: api.description,
    templateId: api.templateId ?? "email-sequence",
    tips: [],
    earningsPerHour: api.earningsPerHour,
  };
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [earningsGoal, setEarningsGoal] = useState(2000);
  const [track, setTrack] = useState<UserTrack>(null);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [fromDb, setFromDb] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    setUserName(user.name || "there");
    setEarningsGoal(user.earningsGoal || 2000);
    setTrack(user.track);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const user = getUser();
    const goal = user.earningsGoal || 2000;
    const skills = (user.skills || []).join(",");
    const hours = user.availableHours || 10;
    fetch(`/api/opportunities?goal=${goal}&skills=${encodeURIComponent(skills)}&hours=${hours}`)
      .then((res) => res.json())
      .then((data: { opportunities?: unknown[]; fromDb?: boolean }) => {
        if (cancelled) return;
        if (data.fromDb === true) {
          setFromDb(true);
          const list = Array.isArray(data.opportunities)
            ? (data.opportunities as Parameters<typeof mapApiToOpportunity>[0][]).map(mapApiToOpportunity)
            : [];
          setOpportunities(list);
        } else {
          setFromDb(false);
          const withEph = staticOpportunities.map((o) => ({
            ...o,
            earningsPerHour:
              computeEarningsPerHour(
                o.avgEarnings,
                o.timeToDeliver,
                o.competition,
                o.demandScore
              ),
          }));
          const currentGoal = getUser().earningsGoal || 2000;
          const ranked = rankOpportunitiesByGoal(
            withEph,
            currentGoal,
            estimateMonthlyPotential,
            (o) => o.demandScore
          );
          setOpportunities(ranked);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFromDb(false);
          const withEph = staticOpportunities.map((o) => ({
            ...o,
            earningsPerHour: computeEarningsPerHour(
              o.avgEarnings,
              o.timeToDeliver,
              o.competition,
              o.demandScore
            ),
          }));
          const currentGoal = getUser().earningsGoal || 2000;
          const ranked = rankOpportunitiesByGoal(
            withEph,
            currentGoal,
            estimateMonthlyPotential,
            (o) => o.demandScore
          );
          setOpportunities(ranked);
        }
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [earningsGoal]);

  const displayOpportunities = loaded ? opportunities : staticOpportunities;
  const isLiveEmpty = fromDb && loaded && opportunities.length === 0;

  const hotOpportunities = displayOpportunities.filter((o) => o.isHot);
  const otherOpportunities = displayOpportunities.filter((o) => !o.isHot);
  const risingCount = displayOpportunities.filter((o) => o.trend === "rising").length;
  const earned = 340;
  const goalPercent = Math.round((earned / earningsGoal) * 100);

  // Uber mode: find the top un-skipped opportunity (only when we have opportunities)
  const availableOpps = displayOpportunities.filter(
    (o) => !skippedIds.includes(o.id)
  );
  const primaryTask =
    availableOpps.length > 0
      ? availableOpps.sort((a, b) => b.demandScore - a.demandScore)[0]
      : displayOpportunities[0];

  const handleSkip = () => {
    setSkippedIds([...skippedIds, primaryTask.id]);
  };

  const runScan = async () => {
    setScanStatus("running");
    setScanError(null);
    try {
      const res = await fetch("/api/bots/scan/trigger", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setScanError(data.error || "Scan failed");
        setScanStatus("error");
        return;
      }
      setScanStatus("success");
      // Refetch opportunities so the list updates
      const u = getUser();
      const oppRes = await fetch(`/api/opportunities?goal=${u.earningsGoal || 2000}&skills=${encodeURIComponent((u.skills || []).join(","))}&hours=${u.availableHours || 10}`);
      const oppData = await oppRes.json();
      if (oppData.fromDb === true) {
        setFromDb(true);
        const list = Array.isArray(oppData.opportunities)
          ? (oppData.opportunities as Parameters<typeof mapApiToOpportunity>[0][]).map(mapApiToOpportunity)
          : [];
        setOpportunities(list);
      }
    } catch (e) {
      setScanError(e instanceof Error ? e.message : "Scan failed");
      setScanStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-6 lg:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Sparkles className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="text-xs">
              {fromDb ? "Source: Live (from your bots)" : "Source: Sample data"}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold lg:text-3xl">Hey {userName}!</h2>
          <p className="mt-1 max-w-xl text-muted-foreground">
            {track === "track_a"
              ? "Your bots are scanning for signals related to your idea. Here are today's opportunities and tools."
              : "Your bots have been scanning while you were away. Here's what they found."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-background/80 px-3 py-2">
              <Radar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {isLiveEmpty ? "0" : displayOpportunities.length} opportunities
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-background/80 px-3 py-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {risingCount} trending up
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-background/80 px-3 py-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                $150-300 potential today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state when DB is connected but no opportunities yet */}
      {isLiveEmpty && (
        <Card className="border-primary/20 bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Radar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No opportunities from your bots yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              Run a scan or check back after the next cron. First time? Run the scan once to populate opportunities.
            </p>
            <Button
              onClick={runScan}
              disabled={scanStatus === "running"}
              className="gap-2"
            >
              {scanStatus === "running" ? "Running scan…" : "Run scan"}
            </Button>
            {scanStatus === "success" && (
              <p className="mt-3 text-sm text-green-600 dark:text-green-400">Scan finished. Refresh or wait for the list to update.</p>
            )}
            {scanStatus === "error" && scanError && (
              <p className="mt-3 text-sm text-destructive">{scanError}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Primary Task - Uber Mode (Track B or default) */}
      {track !== "track_a" && !isLiveEmpty && primaryTask && (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    Your next task
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Best match
                  </Badge>
                </div>

                <h3 className="text-xl font-bold mb-2">{primaryTask.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {primaryTask.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold">
                      {primaryTask.avgEarnings}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {primaryTask.timeToDeliver}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/20 text-primary"
                  >
                    Demand: {primaryTask.demandScore}/100
                  </Badge>
                </div>

                <div className="flex gap-3">
                  <Button size="lg" className="gap-2" asChild>
                    <Link
                      href={`/dashboard/opportunity/${primaryTask.id}`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Accept Task
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={handleSkip}
                  >
                    <SkipForward className="h-4 w-4" />
                    Skip
                  </Button>
                </div>
              </div>

              {/* Demand visualization */}
              <div className="hidden lg:flex w-48 items-center justify-center bg-primary/5 border-l border-primary/10 p-6">
                <div className="text-center">
                  <div className="relative h-24 w-24 mx-auto">
                    <svg
                      className="h-24 w-24 -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-muted"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeDasharray={`${primaryTask.demandScore} ${100 - primaryTask.demandScore}`}
                        className="text-primary"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-primary">
                      {primaryTask.demandScore}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Demand Score
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Tracker */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Monthly Goal</span>
            </div>
            <Link
              href="/dashboard/earnings"
              className="text-sm text-primary hover:underline"
            >
              ${earned} / ${earningsGoal.toLocaleString()}
            </Link>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Complete 2 more opportunities this week to stay on track
          </p>
        </CardContent>
      </Card>

      {/* Hot Opportunities */}
      {!isLiveEmpty && (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Hot Right Now</h3>
            <p className="text-sm text-muted-foreground">
              High demand, low competition, strong AI advantage
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-primary"
            asChild
          >
            <Link href="/dashboard/templates">
              View templates
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {hotOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </div>
      )}

      {/* More Opportunities */}
      {!isLiveEmpty && (
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">More Opportunities</h3>
          <p className="text-sm text-muted-foreground">
            Solid plays your bots identified today
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {otherOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
