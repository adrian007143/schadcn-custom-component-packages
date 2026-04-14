"use client";

import { useState } from "react";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  buildCssExport,
  exportThemeAsJson,
  parseThemeJson,
} from "@/lib/theme/utils";
import { useThemeBuilderState } from "./useThemeBuilderState";
import { dispatchThemeAction } from "./dispatchThemeAction";

export function ExportPanel() {
  const themeState = useThemeBuilderState();
  const [importJson, setImportJson] = useState("");

  const { activePreset, customLight, customDark, radius } = themeState;
  const cssExport = buildCssExport(activePreset, customLight, customDark, radius);
  const jsonExport = JSON.stringify(
    exportThemeAsJson(activePreset, customLight, customDark, radius),
    null,
    2
  );

  const handleImportJson = () => {
    const parsed = parseThemeJson(importJson);

    if (!parsed) {
      toast.error("Invalid JSON format");
      return;
    }

    dispatchThemeAction("importThemeOverrides", {
      preset: parsed.activePreset,
      customLight: parsed.customLight,
      customDark: parsed.customDark,
      radius: parsed.radius,
    });

    setImportJson("");
    toast.success("Theme imported successfully");
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="css" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>

        <TabsContent value="css" className="space-y-3">
          <div className="text-xs text-muted-foreground">
            Copy-paste this into your <code>globals.css</code>
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
            Share this JSON or import it later
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

        <TabsContent value="import" className="space-y-3">
          <div className="text-xs text-muted-foreground">
            Paste a theme JSON to import it
          </div>
          <Textarea
            placeholder="Paste JSON theme here..."
            value={importJson}
            onChange={(event) => setImportJson(event.target.value)}
            className="h-[300px] resize-none font-mono text-xs"
          />
          <Button
            onClick={handleImportJson}
            disabled={!importJson.trim()}
            className="w-full gap-2"
            size="sm"
          >
            <Download className="h-4 w-4" />
            Import Theme
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
