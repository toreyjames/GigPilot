import { notFound } from "next/navigation";
import Link from "next/link";
import { getOpportunityById, getTemplateById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Clock,
  Users,
  Flame,
  Lightbulb,
  Zap,
  ExternalLink,
} from "lucide-react";

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

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunity = getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  const template = getTemplateById(opportunity.templateId);
  const TrendIcon = trendIcons[opportunity.trend];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Opportunities
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{opportunity.category}</Badge>
          {opportunity.isHot && (
            <Badge className="gap-1 bg-primary text-primary-foreground">
              <Flame className="h-3 w-3" />
              Hot Right Now
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            Found {opportunity.foundAt}
          </span>
        </div>
        <h1 className="text-2xl font-bold lg:text-3xl">{opportunity.title}</h1>
        <p className="mt-2 text-muted-foreground">{opportunity.description}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <DollarSign className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="text-lg font-bold">{opportunity.avgEarnings}</p>
            <p className="text-xs text-muted-foreground">Avg Earnings</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <Clock className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
            <p className="text-lg font-bold">{opportunity.timeToDeliver}</p>
            <p className="text-xs text-muted-foreground">To Deliver</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <TrendIcon className={`mx-auto mb-1 h-5 w-5 ${trendColors[opportunity.trend]}`} />
            <p className="text-lg font-bold capitalize">{opportunity.trend}</p>
            <p className="text-xs text-muted-foreground">Trend</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <Users className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
            <Badge
              variant="outline"
              className={competitionColors[opportunity.competition]}
            >
              {opportunity.competition}
            </Badge>
            <p className="mt-1 text-xs text-muted-foreground">Competition</p>
          </CardContent>
        </Card>
      </div>

      {/* Demand bar */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Demand Score</span>
            <span className="text-sm font-bold text-primary">
              {opportunity.demandScore}/100
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${opportunity.demandScore}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Sourced from {opportunity.source}
          </p>
        </CardContent>
      </Card>

      {/* Detail */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <h2 className="mb-3 text-lg font-semibold">What the Bots Found</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {opportunity.detail}
          </p>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Tips to Maximize Earnings</h2>
          </div>
          <ul className="space-y-3">
            {opportunity.tips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Zap className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Ready to Start?</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {template
                  ? `Use the "${template.title}" template to create your deliverable in ${opportunity.timeToDeliver}`
                  : "Choose a template to get started"}
              </p>
            </div>
            <div className="flex gap-3">
              {template && (
                <Button size="lg" className="gap-2" asChild>
                  <Link href={`/dashboard/templates/${template.id}`}>
                    Start This Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link href="/dashboard/templates">
                  Browse Templates
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
