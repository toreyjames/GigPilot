"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function DashboardTopbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-8">
      {/* Search */}
      <div className="flex flex-1 items-center gap-4 pl-14 lg:pl-0">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search opportunities, templates..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <Badge variant="outline" className="border-primary/30 text-primary">
          3 bots active
        </Badge>
      </div>
    </header>
  );
}
