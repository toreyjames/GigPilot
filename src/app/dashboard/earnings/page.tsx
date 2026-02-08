"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DollarSign,
  TrendingUp,
  Target,
  Calendar,
  Plus,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const categories = [
  "Email Marketing",
  "Content Writing",
  "Digital Products",
  "Resume Writing",
  "Video Scripts",
  "Social Media",
  "E-commerce",
  "AI Automation",
  "Other",
];

const initialEarnings = [
  {
    id: "1",
    title: "Email Welcome Sequence - Shopify Store",
    amount: "$75",
    date: "Feb 5, 2026",
    category: "Email Marketing",
  },
  {
    id: "2",
    title: "Blog Post - SaaS Marketing",
    amount: "$50",
    date: "Feb 4, 2026",
    category: "Content Writing",
  },
  {
    id: "3",
    title: "Pet Portrait x3 - Etsy",
    amount: "$105",
    date: "Feb 3, 2026",
    category: "Digital Products",
  },
  {
    id: "4",
    title: "Resume Rewrite - Tech PM",
    amount: "$60",
    date: "Feb 2, 2026",
    category: "Resume Writing",
  },
  {
    id: "5",
    title: "Product Descriptions x5 - Amazon FBA",
    amount: "$50",
    date: "Feb 1, 2026",
    category: "E-commerce",
  },
];

export default function EarningsPage() {
  const [earnings, setEarnings] = useState(initialEarnings);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    notes: "",
  });

  const handleSave = () => {
    if (!form.title || !form.amount || !form.category) return;
    const newEarning = {
      id: String(earnings.length + 1),
      title: form.title,
      amount: `$${form.amount}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category: form.category,
    };
    setEarnings([newEarning, ...earnings]);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSheetOpen(false);
      setForm({ title: "", amount: "", category: "", notes: "" });
    }, 1500);
  };

  const totalThisMonth = earnings.reduce((sum, e) => {
    const num = parseFloat(e.amount.replace("$", ""));
    return sum + num;
  }, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Earnings Tracker</h2>
          <p className="mt-1 text-muted-foreground">
            Track your income and stay on target
          </p>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Log Earnings
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Log New Earning</SheetTitle>
            </SheetHeader>
            {saved ? (
              <div className="flex flex-col items-center justify-center py-16">
                <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
                <p className="text-lg font-semibold">Earning Logged!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  +${form.amount} added to your tracker
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-6">
                <div>
                  <Label htmlFor="earn-title">
                    What did you do? <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="earn-title"
                    placeholder="e.g. Email sequence for Shopify store"
                    className="mt-1.5"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="earn-amount">
                    Amount earned ($){" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="earn-amount"
                    type="number"
                    placeholder="e.g. 75"
                    className="mt-1.5"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm({ ...form, category: value })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="earn-notes">Notes (optional)</Label>
                  <Textarea
                    id="earn-notes"
                    placeholder="Client name, platform, any details..."
                    className="mt-1.5"
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                </div>
                <Button
                  className="w-full gap-2 mt-2"
                  onClick={handleSave}
                  disabled={!form.title || !form.amount || !form.category}
                >
                  <DollarSign className="h-4 w-4" />
                  Log Earning
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "This Month",
            value: `$${totalThisMonth}`,
            change: "+$120 from last month",
            icon: DollarSign,
            trend: "up",
          },
          {
            title: "Monthly Goal",
            value: `${Math.round((totalThisMonth / 2000) * 100)}%`,
            change: `$${totalThisMonth} of $2,000`,
            icon: Target,
            trend: "neutral",
          },
          {
            title: "Tasks Completed",
            value: String(earnings.length),
            change: "This month",
            icon: Calendar,
            trend: "neutral",
          },
          {
            title: "Avg per Task",
            value: `$${(totalThisMonth / earnings.length).toFixed(2)}`,
            change: "+$7.50 from avg",
            icon: TrendingUp,
            trend: "up",
          },
        ].map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  {stat.title}
                </span>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                {stat.trend === "up" && (
                  <ArrowUpRight className="h-3 w-3 text-primary" />
                )}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Earnings chart placeholder */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <h3 className="mb-4 font-semibold">Earnings Over Time</h3>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
            <div className="text-center">
              <TrendingUp className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Chart will appear as you log more earnings
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Recharts integration coming in Phase 4
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent earnings */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <h3 className="mb-4 font-semibold">Recent Earnings</h3>
          <div className="space-y-3">
            {earnings.map((earning) => (
              <div
                key={earning.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{earning.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {earning.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {earning.date}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">
                  {earning.amount}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
