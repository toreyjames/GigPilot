import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Radar,
  Activity,
  Globe,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";

const bots = [
  {
    id: "fiverr-scout",
    name: "Fiverr Scout",
    description:
      "Scans Fiverr search trends, gig pricing, order volume, and competition levels across 15+ categories.",
    status: "active",
    lastScan: "12 min ago",
    opportunitiesFound: 847,
    todayFinds: 3,
    sources: ["Fiverr Search", "Fiverr Categories", "Fiverr Trending"],
  },
  {
    id: "upwork-scout",
    name: "Upwork Scout",
    description:
      "Monitors Upwork job postings, proposal counts, budgets, and hiring patterns to find demand/supply gaps.",
    status: "active",
    lastScan: "8 min ago",
    opportunitiesFound: 623,
    todayFinds: 2,
    sources: ["Upwork Jobs", "Upwork Categories", "Upwork Reports"],
  },
  {
    id: "trend-scout",
    name: "Trend Scout",
    description:
      "Tracks Google Trends data for breakout searches, seasonal spikes, and emerging service categories.",
    status: "active",
    lastScan: "1 hour ago",
    opportunitiesFound: 312,
    todayFinds: 1,
    sources: ["Google Trends API", "Google Search Console"],
  },
  {
    id: "reddit-scout",
    name: "Reddit Scout",
    description:
      "Scans business, freelancing, and side hustle subreddits for pain posts, requests, and unmet demand signals.",
    status: "idle",
    lastScan: "3 hours ago",
    opportunitiesFound: 189,
    todayFinds: 0,
    sources: ["r/freelance", "r/smallbusiness", "r/Entrepreneur", "r/sidehustle"],
  },
  {
    id: "marketplace-scout",
    name: "Marketplace Scout",
    description:
      "Monitors Etsy trending searches, Amazon product opportunities, and KDP niches for digital product plays.",
    status: "active",
    lastScan: "25 min ago",
    opportunitiesFound: 456,
    todayFinds: 2,
    sources: ["Etsy Trends", "Amazon Opportunity Explorer", "KDP Niches"],
  },
];

export default function BotsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Bots</h2>
          <p className="mt-1 text-muted-foreground">
            Scout bots scanning the market 24/7 to find you money-making
            opportunities
          </p>
        </div>
        <Badge variant="secondary" className="gap-1 border-primary/20 text-primary">
          <Activity className="h-3 w-3" />
          4 of 5 active
        </Badge>
      </div>

      {/* Bot overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="p-5 text-center">
            <Radar className="mx-auto mb-2 h-6 w-6 text-primary" />
            <p className="text-2xl font-bold">2,427</p>
            <p className="text-sm text-muted-foreground">
              Total opportunities found
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5 text-center">
            <Globe className="mx-auto mb-2 h-6 w-6 text-primary" />
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm text-muted-foreground">Sources monitored</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5 text-center">
            <Clock className="mx-auto mb-2 h-6 w-6 text-primary" />
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">
              New finds today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bot cards */}
      <div className="space-y-4">
        {bots.map((bot) => (
          <Card key={bot.id} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{bot.name}</h3>
                      <div className="flex items-center gap-1">
                        {bot.status === "active" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span
                          className={`text-xs ${
                            bot.status === "active"
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {bot.status === "active" ? "Active" : "Idle"}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {bot.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {bot.sources.map((source) => (
                        <Badge
                          key={source}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:text-right">
                  <div>
                    <p className="text-lg font-bold">{bot.todayFinds}</p>
                    <p className="text-[10px] text-muted-foreground">
                      today
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {bot.opportunitiesFound.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      all time
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Last scan
                    </p>
                    <p className="text-sm font-medium">{bot.lastScan}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
