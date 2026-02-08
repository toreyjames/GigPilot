import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Zap,
  DollarSign,
  Bot,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Rocket,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">GigPilot</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center lg:pt-28">
        <Badge
          variant="secondary"
          className="mb-6 gap-1 border-primary/20 px-3 py-1"
        >
          <Sparkles className="h-3 w-3 text-primary" />
          <span>AI bots scanning the market 24/7</span>
        </Badge>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight lg:text-6xl">
          The missing layer between{" "}
          <span className="text-primary">AI and income.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl">
          Whether you have an idea or need one, GigPilot uses AI bots to find
          real opportunities and gives you the tools to turn them into money.
        </p>
      </section>

      {/* Two-Track Fork */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Track A */}
          <Link href="/signup?track=a" className="block group">
            <div className="h-full rounded-2xl border-2 border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 cursor-pointer">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-5">
                <Lightbulb className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">I have an idea</h2>
              <p className="text-muted-foreground mb-6">
                You know what you want to build or sell. You need market
                intelligence, AI tools to execute, and a plan to launch it.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Validate your idea with live market data",
                  "AI builds your product, content, or service",
                  "Get a week-by-week execution plan",
                  "Launch and track your revenue",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                Start with your idea
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Track B */}
          <Link href="/signup?track=b" className="block group">
            <div className="h-full rounded-2xl border-2 border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 cursor-pointer">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-5">
                <Rocket className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Show me how to earn</h2>
              <p className="text-muted-foreground mb-6">
                You want to make money with AI but need direction. Our bots find
                the opportunities. You just press the button.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Bots scan 5+ sources for live opportunities",
                  "Get one task at a time - like accepting an Uber ride",
                  "AI generates the deliverable in minutes",
                  "We show you exactly how to sell it and get paid",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                Find me opportunities
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold lg:text-4xl">
              Two paths, one platform
            </h2>
            <p className="mt-3 text-muted-foreground">
              Whether you lead or we lead, the same AI engine powers your income
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-4">
            {[
              {
                icon: Bot,
                title: "Bots Hunt 24/7",
                description:
                  "Scout bots scan X, Reddit, TikTok, Google Trends, and marketplaces looking for gaps where demand is rising but supply hasn't caught up.",
                step: "1",
              },
              {
                icon: Sparkles,
                title: "Signals Surface",
                description:
                  "Raw signals get scored on demand, pain intensity, competition window, and AI advantage. Only the strongest rise to your feed.",
                step: "2",
              },
              {
                icon: Zap,
                title: "AI Builds It",
                description:
                  "Pick an opportunity or bring your own idea. Fill in a few fields. The AI refinery generates a professional deliverable in minutes.",
                step: "3",
              },
              {
                icon: DollarSign,
                title: "You Get Paid",
                description:
                  "We show you exactly where to sell and how to deliver. Log your earnings. The platform learns what works and finds you more.",
                step: "4",
              },
            ].map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                  Step {step.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold lg:text-4xl">
            The intelligence layer no one else has
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
            ChatGPT gives you output. GigPilot finds the opportunity, builds the
            product, and shows you how to sell it.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Bot,
              title: "Pre-product detection",
              points: [
                "Spots opportunities BEFORE they hit mainstream",
                "Scans X, Reddit, TikTok, Google Trends",
                "Multi-source signal convergence scoring",
                "You're early, not late",
              ],
            },
            {
              icon: Zap,
              title: "From signal to income",
              points: [
                "AI generates the deliverable in minutes",
                "Step-by-step delivery guidance",
                "Pitch templates to land clients",
                "Full pipeline from idea to paid",
              ],
            },
            {
              icon: TrendingUp,
              title: "Gets smarter over time",
              points: [
                "Tracks what actually earns money",
                "Bots learn from validated signals",
                "Surfaces better opportunities each week",
                "Your bots become uniquely tuned to you",
              ],
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border/50 bg-card p-6"
            >
              <feature.icon className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-4 text-lg font-semibold">{feature.title}</h3>
              <ul className="space-y-2.5">
                {feature.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold lg:text-4xl">
            Your bots are ready to start hunting
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stop scrolling YouTube videos about making money with AI. Open
            GigPilot and actually do it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="gap-2 text-base" asChild>
              <Link href="/signup?track=a">
                <Lightbulb className="h-4 w-4" />
                I Have an Idea
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base"
              asChild
            >
              <Link href="/signup?track=b">
                <Rocket className="h-4 w-4" />
                Show Me How to Earn
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <TrendingUp className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold">GigPilot</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} GigPilot. The missing layer
              between AI and income.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
