"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, saveUser } from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  TrendingUp,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Search,
} from "lucide-react";

const CATEGORIES = [
  "Content & Writing",
  "E-commerce & Products",
  "Digital Products & Downloads",
  "Social Media & Marketing",
  "Video & YouTube",
  "Design & Branding",
  "AI Automation & Bots",
  "Education & Courses",
  "Music & Audio",
  "Other",
];

const EXAMPLES = [
  "I want to sell AI-generated pet portraits on Etsy",
  "I want to start a faceless YouTube channel about personal finance",
  "I want to offer social media management to local restaurants",
  "I want to create and sell coloring books on Amazon KDP",
  "I want to build chatbots for dental practices",
  "I want to sell email marketing services to Shopify stores",
];

export default function IdeaPage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [category, setCategory] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user.isLoggedIn) {
      router.push("/signup?track=a");
    }
  }, [router]);

  const handleAnalyze = () => {
    if (!idea || !category) return;
    saveUser({ idea, ideaCategory: category });
    setAnalyzing(true);
    // Simulate analysis time
    setTimeout(() => {
      router.push("/idea/report");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">GigPilot</span>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Lightbulb className="h-3 w-3 text-primary" />
            Entrepreneur Path
          </Badge>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4 gap-1">
            <Sparkles className="h-3 w-3 text-primary" />
            Tell us your idea
          </Badge>
          <h1 className="text-3xl font-bold lg:text-4xl">
            What do you want to <span className="text-primary">build?</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Describe your idea and our bots will scan the market to tell you if
            there&apos;s real demand, what the competition looks like, and how to
            execute it.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="idea" className="text-base font-medium">
              Describe your idea
            </Label>
            <Textarea
              id="idea"
              placeholder="e.g. I want to sell AI-generated pet portraits on Etsy as digital downloads..."
              className="mt-2 min-h-[120px] text-base"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-base font-medium">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full gap-2 text-base"
            size="lg"
            onClick={handleAnalyze}
            disabled={!idea || !category || analyzing}
          >
            {analyzing ? (
              <>
                <Search className="h-4 w-4 animate-pulse" />
                Bots are analyzing your idea...
              </>
            ) : (
              <>
                Analyze My Idea
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Examples */}
          <div className="pt-4">
            <p className="text-xs text-muted-foreground mb-3 text-center">
              Not sure? Try one of these:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setIdea(ex)}
                  className="rounded-full border border-border/50 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors cursor-pointer"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
