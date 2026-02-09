"use client";

import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/lib/data";

const trendIcons = {
  rising: TrendingUp,
  stable: Minus,
  falling: TrendingDown,
};

const trendColors = {
  rising: "text-primary",
  stable: "text-muted-foreground",
  falling: "text-destructive",
};

const competitionColors = {
  low: "bg-primary/10 text-primary border-primary/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

export function OpportunityCard({
  opportunity,
}: {
  opportunity: Opportunity;
}) {
  const TrendIcon = trendIcons[opportunity.trend];

  return (
    <Link href={`/dashboard/opportunity/${opportunity.id}`} className="block">
      <Card className="group relative overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer h-full">
        {opportunity.isHot && (
          <div className="absolute top-0 right-0">
            <div className="flex items-center gap-1 rounded-bl-lg bg-primary px-2.5 py-1">
              <Flame className="h-3 w-3 text-primary-foreground" />
              <span className="text-[10px] font-bold uppercase text-primary-foreground">
                Hot
              </span>
            </div>
          </div>
        )}

        <CardContent className="p-5">
          {/* Header */}
          <div className="mb-3">
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {opportunity.category}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                Found {opportunity.foundAt}
              </span>
            </div>
            <h3 className="text-base font-semibold leading-tight">
              {opportunity.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {opportunity.description}
            </p>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-semibold">{opportunity.avgEarnings}</p>
                <p className="text-[10px] text-muted-foreground">avg earnings</p>
                {opportunity.earningsPerHour != null && (
                  <p className="text-[10px] text-primary font-medium mt-0.5">
                    ~${opportunity.earningsPerHour}/hr est.
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">
                  {opportunity.timeToDeliver}
                </p>
                <p className="text-[10px] text-muted-foreground">to deliver</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendIcon
                className={cn("h-4 w-4", trendColors[opportunity.trend])}
              />
              <div>
                <p className="text-sm font-semibold capitalize">
                  {opportunity.trend}
                </p>
                <p className="text-[10px] text-muted-foreground">trend</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px]",
                    competitionColors[opportunity.competition]
                  )}
                >
                  {opportunity.competition} competition
                </Badge>
              </div>
            </div>
          </div>

          {/* Demand bar */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Demand Score
              </span>
              <span className="text-xs font-semibold text-primary">
                {opportunity.demandScore}/100
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${opportunity.demandScore}%` }}
              />
            </div>
          </div>

          {/* CTA */}
          <Button className="w-full gap-2 group-hover:shadow-md" size="sm">
            Start This Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>

          {/* Source */}
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Sourced from {opportunity.source}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
