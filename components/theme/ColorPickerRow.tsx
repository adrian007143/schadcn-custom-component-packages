"use client";

import {
  memo,
  startTransition,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ThemeCssVar } from "@/lib/theme/types";
import {
  extractAlpha,
  hexToOklch,
  oklchToHex,
  oklchToString,
  reapplyAlpha,
  stripAlpha,
} from "@/lib/theme/utils";
import { dispatchThemeAction } from "./dispatchThemeAction";

export type ColorPickerRowProps = {
  label: string;
  varName: ThemeCssVar;
  mode: "light" | "dark";
  resolvedValue: string;
  isCustomized: boolean;
};

function normalizeHex(value: string): string | null {
  const sanitized = value.trim().replace(/^#/, "");
  if (!/^[\da-fA-F]{6}$/.test(sanitized)) {
    return null;
  }

  return `#${sanitized.toUpperCase()}`;
}

function ColorPickerRowComponent({
  label,
  varName,
  mode,
  resolvedValue,
  isCustomized,
}: ColorPickerRowProps) {
  const { resolvedTheme } = useTheme();
  const inputId = useId();
  const colorInputRef = useRef<HTMLInputElement>(null);
  const alpha = extractAlpha(resolvedValue);
  const colorNoAlpha = stripAlpha(resolvedValue);
  const hexValue = oklchToHex(colorNoAlpha);
  const [draftHex, setDraftHex] = useState<string | null>(null);
  const frameRef = useRef<number | null>(null);
  const queuedHexRef = useRef<string | null>(null);
  const previewedHexRef = useRef<string | null>(null);
  const draftHexValue = draftHex ?? hexValue;

  useEffect(() => {
    if (colorInputRef.current && colorInputRef.current.value !== hexValue) {
      colorInputRef.current.value = hexValue;
    }
  }, [hexValue]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const applyPreviewHex = (nextHex: string) => {
    if (mode !== resolvedTheme) {
      return;
    }

    const nextOklch = oklchToString(hexToOklch(nextHex));
    const finalOklch = alpha ? reapplyAlpha(nextOklch, alpha) : nextOklch;
    document.documentElement.style.setProperty(varName, finalOklch);
    previewedHexRef.current = nextHex;
  };

  const revertPreviewHex = () => {
    if (mode !== resolvedTheme || previewedHexRef.current === null) {
      previewedHexRef.current = null;
      return;
    }

    document.documentElement.style.setProperty(varName, resolvedValue);
    previewedHexRef.current = null;
  };

  const applyHex = (nextHex: string) => {
    const nextOklch = oklchToString(hexToOklch(nextHex));
    const finalOklch = alpha ? reapplyAlpha(nextOklch, alpha) : nextOklch;
    previewedHexRef.current = null;

    if (mode === "light") {
      startTransition(() => {
        dispatchThemeAction("setCustomLight", {
          key: varName,
          value: finalOklch,
        });
      });
      return;
    }

    startTransition(() => {
      dispatchThemeAction("setCustomDark", {
        key: varName,
        value: finalOklch,
      });
    });
  };

  const scheduleHexApply = (nextHex: string) => {
    queuedHexRef.current = nextHex;

    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      if (queuedHexRef.current) {
        applyHex(queuedHexRef.current);
        queuedHexRef.current = null;
      }
    });
  };

  const handleHexCommit = () => {
    const normalized = normalizeHex(draftHexValue);
    if (!normalized) {
      setDraftHex(null);
      return;
    }

    applyHex(normalized);
    setDraftHex(normalized);
  };

  const handleReset = () => {
    revertPreviewHex();

    if (mode === "light") {
      dispatchThemeAction("clearCustomLight", varName);
      return;
    }

    dispatchThemeAction("clearCustomDark", varName);
  };

  return (
    <div className="flex items-center gap-3 border-b border-slate-800/50 py-2.5 text-slate-50 last:border-b-0">
      {/* Color swatch trigger */}
      <label
        htmlFor={inputId}
        className="relative shrink-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-700 bg-slate-950/70 transition-transform hover:scale-[1.05]"
        title={`Pick ${label}`}
      >
        <span
          className="h-7 w-7 rounded-lg border border-white/10"
          style={{ backgroundColor: hexValue }}
        />
        {isCustomized ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute -top-1.5 -left-1.5 size-5 rounded-full border border-slate-700 bg-slate-900/95 text-slate-300 shadow-sm hover:bg-slate-800 hover:text-slate-50"
            onClick={(event) => {
              event.preventDefault();
              handleReset();
            }}
            title="Reset this token to the preset value"
          >
            <RotateCcw className="h-2.5 w-2.5" />
          </Button>
        ) : null}
        <input
          id={inputId}
          ref={colorInputRef}
          type="color"
          defaultValue={hexValue}
          onInput={(event) => {
            const nextHex = (event.target as HTMLInputElement).value.toUpperCase();
            applyPreviewHex(nextHex);
          }}
          onChange={(event) =>
            scheduleHexApply(event.target.value.toUpperCase())
          }
          onBlur={() => {
            revertPreviewHex();
          }}
          className="sr-only"
          title={`${varName}: ${resolvedValue}`}
        />
      </label>

      {/* Label + var name */}
      <div className="min-w-0 flex-1">
        <label
          htmlFor={inputId}
          className="block cursor-pointer text-sm font-medium leading-none text-slate-50"
        >
          {label}
        </label>
        <code className="mt-0.5 block truncate font-mono text-[10px] text-slate-500">
          {varName}
        </code>
      </div>

      {/* Hex input */}
      <Input
        value={draftHexValue}
        onChange={(event) => setDraftHex(event.target.value.toUpperCase())}
        onBlur={handleHexCommit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleHexCommit();
          }
        }}
        className="h-9 w-[108px] shrink-0 rounded-xl border-slate-700 bg-slate-800/90 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-slate-50"
        placeholder="#4F46E5"
        aria-label={`${label} hex color`}
      />

      {/* Apply */}
      <Button
        type="button"
        variant="secondary"
        className="h-9 w-12 shrink-0 rounded-xl border border-slate-700 bg-slate-800/90 px-0 text-xs font-semibold text-slate-100 hover:bg-slate-700/90"
        onClick={handleHexCommit}
      >
        Apply
      </Button>
    </div>
  );
}

export const ColorPickerRow = memo(ColorPickerRowComponent);
