"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, saveUser } from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Clock,
  Sparkles,
  Target,
  CheckCircle2,
  Rocket,
  PenTool,
  Mail,
  Video,
  Palette,
  ShoppingBag,
  FileText,
  Bot,
} from "lucide-react";

const SKILLS = [
  { id: "writing", label: "Writing & Content", icon: PenTool },
  { id: "email", label: "Email Marketing", icon: Mail },
  { id: "social", label: "Social Media", icon: Palette },
  { id: "video", label: "Video & Scripts", icon: Video },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingBag },
  { id: "resumes", label: "Resumes & Career", icon: FileText },
];

const HOURS_OPTIONS = [
  { value: 5, label: "5 hrs/week", desc: "Casual side hustle" },
  { value: 10, label: "10 hrs/week", desc: "Serious side income" },
  { value: 20, label: "20 hrs/week", desc: "Part-time business" },
  { value: 40, label: "40 hrs/week", desc: "Full-time grind" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [earningsGoal, setEarningsGoal] = useState(2000);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableHours, setAvailableHours] = useState(10);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!user.isLoggedIn) {
      router.push("/signup");
      return;
    }
    setUserName(user.name);
  }, [router]);

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    saveUser({
      earningsGoal,
      availableHours,
      skills: selectedSkills,
      onboardingDone: true,
    });
    router.push("/dashboard");
  };

  // Earnings estimate based on inputs
  const tasksPerWeek = Math.floor(availableHours / 0.4); // ~25 min per task avg
  const avgPerTask = 47;
  const monthlyEstimate = tasksPerWeek * avgPerTask * 4;
  const weeksToGoal = Math.ceil(earningsGoal / (tasksPerWeek * avgPerTask));

  const totalSteps = 4;

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
          <span className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Step 1: Earnings Goal */}
        {step === 1 && (
          <div className="space-y-8 text-center">
            <div>
              <Badge variant="secondary" className="mb-4 gap-1">
                <DollarSign className="h-3 w-3 text-primary" />
                Let&apos;s set your target
              </Badge>
              <h1 className="text-3xl font-bold lg:text-4xl">
                How much do you want to earn
                <br />
                <span className="text-primary">per month?</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                This helps your bots prioritize the right opportunities for you.
              </p>
            </div>

            <div className="mx-auto max-w-md">
              <div className="text-center mb-8">
                <span className="text-6xl font-bold text-primary">
                  ${earningsGoal.toLocaleString()}
                </span>
                <span className="text-2xl text-muted-foreground">/mo</span>
              </div>

              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={earningsGoal}
                onChange={(e) => setEarningsGoal(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>$500</span>
                <span>$5,000</span>
                <span>$10,000</span>
              </div>
            </div>

            <Button
              size="lg"
              className="gap-2"
              onClick={() => setStep(2)}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Skills / Interests */}
        {step === 2 && (
          <div className="space-y-8 text-center">
            <div>
              <Badge variant="secondary" className="mb-4 gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                What interests you?
              </Badge>
              <h1 className="text-3xl font-bold lg:text-4xl">
                What kind of work
                <br />
                <span className="text-primary">sounds good to you?</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Pick all that interest you. No experience needed - AI does the
                heavy lifting.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 max-w-lg mx-auto">
              {SKILLS.map((skill) => {
                const selected = selectedSkills.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all cursor-pointer ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 hover:border-primary/30"
                    }`}
                  >
                    <skill.icon className={`h-6 w-6 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">{skill.label}</span>
                    {selected && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setStep(3)}
                disabled={selectedSkills.length === 0}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            {selectedSkills.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Pick at least one to continue
              </p>
            )}
          </div>
        )}

        {/* Step 3: Time Commitment */}
        {step === 3 && (
          <div className="space-y-8 text-center">
            <div>
              <Badge variant="secondary" className="mb-4 gap-1">
                <Clock className="h-3 w-3 text-primary" />
                Time commitment
              </Badge>
              <h1 className="text-3xl font-bold lg:text-4xl">
                How much time can you
                <br />
                <span className="text-primary">commit per week?</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Be honest - we&apos;ll build a realistic plan around your actual
                availability.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {HOURS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAvailableHours(option.value)}
                  className={`flex flex-col items-center rounded-xl border-2 p-5 transition-all cursor-pointer ${
                    availableHours === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                >
                  <span className="text-2xl font-bold">
                    {option.label.split(" ")[0]}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    hrs/week
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {option.desc}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => setStep(2)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setStep(4)}
              >
                See My Plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Your Plan (the aha moment) */}
        {step === 4 && (
          <div className="space-y-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 gap-1">
                <Target className="h-3 w-3 text-primary" />
                Your personalized plan
              </Badge>
              <h1 className="text-3xl font-bold lg:text-4xl">
                Here&apos;s your plan to earn{" "}
                <span className="text-primary">
                  ${earningsGoal.toLocaleString()}/mo
                </span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                {userName ? `${userName}, based` : "Based"} on your skills and
                availability, here&apos;s what your bots recommend.
              </p>
            </div>

            {/* The big number */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Estimated monthly earnings
                </p>
                <p className="text-5xl font-bold text-primary">
                  ${Math.min(monthlyEstimate, earningsGoal * 1.5).toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  ~{tasksPerWeek} tasks/week at ${avgPerTask} avg per task
                </p>
                {monthlyEstimate >= earningsGoal ? (
                  <Badge className="mt-3 gap-1 bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-3 w-3" />
                    Your goal is achievable with your current availability
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mt-3">
                    You&apos;ll reach your goal in ~{weeksToGoal} weeks of
                    ramping up
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Recommended path */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-border/50">
                <CardContent className="p-5 text-center">
                  <Bot className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">
                    Bots scanning for you
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-5 text-center">
                  <Clock className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <p className="text-2xl font-bold">{availableHours}h</p>
                  <p className="text-sm text-muted-foreground">
                    Per week commitment
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-5 text-center">
                  <Sparkles className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <p className="text-2xl font-bold">{selectedSkills.length}</p>
                  <p className="text-sm text-muted-foreground">
                    Skill areas to focus on
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* What happens next */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">What happens next</h3>
                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "Your bots start scanning now",
                      desc: "5 scout bots will begin monitoring Fiverr, Upwork, Etsy, Google Trends, and Reddit for opportunities matching your skills.",
                    },
                    {
                      step: "2",
                      title: "Opportunities appear on your dashboard",
                      desc: "Within minutes you'll see scored, ranked opportunities with earnings estimates and difficulty ratings.",
                    },
                    {
                      step: "3",
                      title: "Pick one and press the easy button",
                      desc: "Choose an opportunity, fill in a few fields, and AI generates the deliverable. Review, polish, deliver, get paid.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {item.step}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => setStep(3)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                size="lg"
                className="gap-2 text-base"
                onClick={handleFinish}
              >
                <Rocket className="h-4 w-4" />
                Launch My Bots
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
