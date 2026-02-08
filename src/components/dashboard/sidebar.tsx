"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Radar,
  Zap,
  DollarSign,
  Bot,
  Settings,
  TrendingUp,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { getUser, clearUser } from "@/lib/user-store";

const iconMap = {
  Radar,
  Zap,
  DollarSign,
  Bot,
  Settings,
} as const;

const navItems = [
  {
    title: "Opportunities",
    href: "/dashboard",
    icon: "Radar" as const,
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: "Zap" as const,
  },
  {
    title: "Earnings",
    href: "/dashboard/earnings",
    icon: "DollarSign" as const,
  },
  {
    title: "Bots",
    href: "/dashboard/bots",
    icon: "Bot" as const,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "Settings" as const,
  },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!user.isLoggedIn) {
      router.push("/signup");
      return;
    }
    setUserName(user.name || "User");
    setInitials(
      (user.name || "U")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    );
  }, [router]);

  const handleLogout = () => {
    clearUser();
    router.push("/");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <TrendingUp className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">
            GigPilot
          </h1>
          <p className="text-[10px] uppercase tracking-wider text-sidebar-primary">
            Bots working for you
          </p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Quick Stats */}
      <div className="px-4 py-4">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <p className="text-xs text-muted-foreground">Today&apos;s Finds</p>
          <p className="text-2xl font-bold text-primary">3</p>
          <p className="text-xs text-muted-foreground">new opportunities</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
              {item.title === "Opportunities" && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">
                {userName}
              </p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <NavContent />
      </aside>

      {/* Mobile sidebar */}
      <div className="fixed top-0 left-0 z-40 p-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar p-0">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-sidebar-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <NavContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
