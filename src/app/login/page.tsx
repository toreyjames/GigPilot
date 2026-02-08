"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveUser } from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, ArrowRight, Bot } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    saveUser({
      name: email.split("@")[0],
      email,
      isLoggedIn: true,
      onboardingDone: true,
    });
    router.push("/dashboard");
  };

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
            Welcome back.
            <br />
            <span className="text-primary">Your bots never stopped.</span>
          </h2>
          <p className="mt-4 text-sidebar-foreground/60 max-w-md">
            While you were away, your bots have been scanning for new
            opportunities. Log in to see what they found.
          </p>

          <div className="mt-8 flex items-center gap-3 rounded-lg bg-sidebar-accent p-4">
            <Bot className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">
                3 new opportunities waiting
              </p>
              <p className="text-xs text-sidebar-foreground/60">
                Found while you were away
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
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">GigPilot</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold">Log in to GigPilot</h1>
            <p className="mt-1 text-muted-foreground">
              Your bots have been busy. Let&apos;s see what they found.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Enter your password"
                className="mt-1.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={!email || !password}
            >
              Log In
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" size="lg" onClick={() => {
            saveUser({ name: "User", email: "user@demo.com", isLoggedIn: true, onboardingDone: true });
            router.push("/dashboard");
          }}>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
