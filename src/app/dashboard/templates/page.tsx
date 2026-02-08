import Link from "next/link";
import { templates } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  PenTool,
  FileText,
  Video,
  Palette,
  ShoppingBag,
  ArrowRight,
  Clock,
  DollarSign,
  Star,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  PenTool,
  FileText,
  Video,
  Palette,
  ShoppingBag,
};

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold">AI Templates</h2>
        <p className="mt-1 text-muted-foreground">
          Your easy buttons. Pick a template, fill in the fields, AI does the
          work. You deliver and get paid.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => {
          const Icon = iconMap[template.icon] || Mail;
          return (
            <Link
              key={template.id}
              href={`/dashboard/templates/${template.id}`}
              className="block"
            >
              <Card className="group overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    {template.popular && (
                      <Badge
                        variant="secondary"
                        className="gap-1 border-primary/20 text-primary"
                      >
                        <Star className="h-3 w-3" />
                        Popular
                      </Badge>
                    )}
                  </div>

                  <Badge variant="outline" className="mb-2 text-xs">
                    {template.category}
                  </Badge>
                  <h3 className="mb-1 text-base font-semibold">
                    {template.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>

                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-medium">
                        {template.avgEarnings}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {template.timeToComplete}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {template.difficulty}
                    </Badge>
                  </div>

                  <Button className="w-full gap-2" size="sm">
                    Use Template
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
