"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { buildCssExport, exportThemeAsJson } from "@/lib/theme/utils";

import { useThemeBuilderState } from "./useThemeBuilderState";

export function ExportPanel() {
  const { activePreset, customLight, customDark, radius } =
    useThemeBuilderState();

  const cssExport = buildCssExport(activePreset, customLight, customDark, radius);
  const jsonExport = JSON.stringify(
    exportThemeAsJson(activePreset, customLight, customDark, radius),
    null,
    2
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="css" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="css" className="space-y-3">
          <div className="text-xs text-muted-foreground">
            Copy this into <code>globals.css</code> if you want to persist the
            current palette outside the live builder.
          </div>
          <Textarea
            value={cssExport}
            readOnly
            className="h-[300px] resize-none font-mono text-xs"
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(cssExport);
              toast.success("CSS copied to clipboard");
            }}
            className="w-full gap-2"
            size="sm"
          >
            <Copy className="h-4 w-4" />
            Copy CSS
          </Button>
        </TabsContent>

        <TabsContent value="json" className="space-y-3">
          <div className="text-xs text-muted-foreground">
            Copy this JSON if you want to share or version the current preset
            state.
          </div>
          <Textarea
            value={jsonExport}
            readOnly
            className="h-[300px] resize-none font-mono text-xs"
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(jsonExport);
              toast.success("JSON copied to clipboard");
            }}
            className="w-full gap-2"
            size="sm"
          >
            <Copy className="h-4 w-4" />
            Copy JSON
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
