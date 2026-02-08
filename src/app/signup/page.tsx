"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { saveUser } from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, ArrowRight, Bot, Lightbulb, Rocket } from "lucide-react";
import { Suspense } from "react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackParam = searchParams.get("track");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [track, setTrack] = useState<"a" | "b" | null>(
    trackParam === "a" ? "a" : trackParam === "b" ? "b" : null
  );

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    saveUser({
      name,
      email,
      isLoggedIn: true,
      onboardingDone: false,
      track: track === "a" ? "track_a" : "track_b",
    });

    if (track === "a") {
      router.push("/idea");
    } else {
      router.push("/onboarding");
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <TrendingUp className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold">GigPilot</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-muted-foreground">
          Free to start. Your bots begin scanning immediately.
        </p>
      </div>

      {/* Track selection if not pre-selected */}
      {!track && (
        <div className="space-y-3">
          <p className="text-sm font-medium">What brings you to GigPilot?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTrack("a")}
              className="flex flex-col items-center gap-2 rounded-xl border-2 border-border/50 p-4 transition-all hover:border-primary/30 cursor-pointer"
            >
              <Lightbulb className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-center">
                I have an idea
              </span>
            </button>
            <button
              onClick={() => setTrack("b")}
              className="flex flex-col items-center gap-2 rounded-xl border-2 border-border/50 p-4 transition-all hover:border-primary/30 cursor-pointer"
            >
              <Rocket className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-center">
                Show me how to earn
              </span>
            </button>
          </div>
        </div>
      )}

      {track && (
        <>
          {/* Selected track indicator */}
          <div
            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 cursor-pointer"
            onClick={() => setTrack(null)}
          >
            {track === "a" ? (
              <Lightbulb className="h-4 w-4 text-primary" />
            ) : (
              <Rocket className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm font-medium">
              {track === "a"
                ? "I have an idea to build"
                : "Show me opportunities to earn"}
            </span>
            <span className="ml-auto text-xs text-muted-foreground">
              change
            </span>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                placeholder="e.g. Sarah"
                className="mt-1.5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                className="mt-1.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={!name || !email || !password}
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">
            GigPilot
          </span>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-sidebar-foreground leading-tight">
            Got an idea?
            <br />
            <span className="text-primary">We&apos;ll help you build it.</span>
            <br />
            <br />
            Need direction?
            <br />
            <span className="text-primary">
              We&apos;ll find you the money.
            </span>
          </h2>
          <p className="mt-6 text-sidebar-foreground/60 max-w-md">
            Two paths, one platform. Whether you bring the idea or we bring the
            opportunity, AI does the heavy lifting.
          </p>

          <div className="mt-8 flex items-center gap-3 rounded-lg bg-sidebar-accent p-4">
            <Bot className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">
                5 bots standing by
              </p>
              <p className="text-xs text-sidebar-foreground/60">
                Scanning X, Reddit, TikTok, Google Trends, and marketplaces
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-sidebar-foreground/40">
          &copy; {new Date().getFullYear()} GigPilot
        </p>
      </div>

      {/* Right side - form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <Suspense fallback={<div />}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
