"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Preview Panel
 * Displays live examples of shadcn/ui components using current theme.
 * No props needed - components automatically pick up CSS variables from document.
 */
export function PreviewPanel() {
  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card/40 p-4 text-sm">
      <div className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Actions
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="default">Default</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
          <Button size="sm" variant="destructive">Delete</Button>
          <Button size="sm" variant="outline">Outline</Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Status
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge>Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-3">
        <Input placeholder="Type something..." className="h-9 text-xs" />

        <div className="flex items-center justify-between gap-4 rounded-md border border-border/70 p-3">
          <div className="space-y-1">
            <p className="text-xs font-medium">Interface settings</p>
            <p className="text-xs text-muted-foreground">
              Check contrast, borders, and accents.
            </p>
          </div>
          <Switch defaultChecked aria-label="Preview switch" />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="preview-check" />
          <Label htmlFor="preview-check" className="cursor-pointer text-xs">
            Remember this theme
          </Label>
        </div>

        <Progress value={64} className="h-2" />
      </div>

      <Alert className="py-2">
        <AlertCircle className="h-3 w-3" />
        <AlertDescription className="ml-2 text-xs">
          Changes apply in real-time
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="surface" className="w-full gap-2">
        <TabsList className="grid h-9 w-full grid-cols-2 rounded-lg bg-muted/70 p-1">
          <TabsTrigger className="text-xs" value="surface">Surface</TabsTrigger>
          <TabsTrigger className="text-xs" value="states">States</TabsTrigger>
        </TabsList>
        <TabsContent
          value="surface"
          className="mt-0 rounded-md border border-border/70 bg-background/60 p-3 text-xs text-muted-foreground"
        >
          Cards, popovers, and panels inherit these background and border tokens.
        </TabsContent>
        <TabsContent
          value="states"
          className="mt-0 rounded-md border border-border/70 bg-background/60 p-3 text-xs text-muted-foreground"
        >
          Primary, muted, destructive, and focus treatments should stay readable.
        </TabsContent>
      </Tabs>
    </div>
  );
}
