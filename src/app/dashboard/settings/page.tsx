import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="mt-1 text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Profile</h3>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Mike" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue="mike@example.com"
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="goal">Monthly Earnings Goal</Label>
              <Input
                id="goal"
                defaultValue="2000"
                type="number"
                className="mt-1.5 max-w-xs"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Your bots will prioritize opportunities to help you hit this
              </p>
            </div>
            <Button size="sm">Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Subscription</h3>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Free Plan</span>
                <Badge variant="outline">Current</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                3 template generations per month, basic intelligence
              </p>
            </div>
            <Button variant="outline" size="sm">
              Upgrade
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            {[
              {
                name: "Starter",
                price: "$29/mo",
                desc: "50 generations, full intelligence, earnings tracker",
              },
              {
                name: "Pro",
                price: "$99/mo",
                desc: "Unlimited generations, agency mode, white-label, priority AI",
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:border-primary/30 transition-colors"
              >
                <div>
                  <span className="font-medium">{plan.name}</span>
                  <span className="ml-2 text-sm text-primary font-semibold">
                    {plan.price}
                  </span>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {plan.desc}
                  </p>
                </div>
                <Button size="sm">Select</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Control when and how your bots notify you about new opportunities.
          </p>
          <p className="mt-4 text-sm text-muted-foreground italic">
            Notification preferences coming soon.
          </p>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-destructive" />
            <h3 className="font-semibold text-destructive">Danger Zone</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Delete your account and all associated data. This action cannot be
            undone.
          </p>
          <Button variant="outline" size="sm" className="mt-3 text-destructive border-destructive/30 hover:bg-destructive/10">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
