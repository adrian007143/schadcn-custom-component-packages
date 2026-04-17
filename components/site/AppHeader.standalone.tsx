"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeBuilderTrigger } from "@/components/theme/ThemeBuilderTrigger";
import { Button } from "@/components/ui/button";

import { ThemeToggle } from "./ThemeToggle";

type AppHeaderLink = {
  href: string;
  label: string;
};

type AppHeaderProps = {
  brand?: ReactNode;
  links?: AppHeaderLink[];
  rightSlot?: ReactNode;
};

const DEFAULT_LINKS: AppHeaderLink[] = [
  { href: "/components", label: "Components" },
  { href: "/docs", label: "Docs" },
  { href: "/examples", label: "Examples" },
];

export function AppHeader({
  brand = "Your App",
  links = DEFAULT_LINKS,
  rightSlot,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mr-6 flex items-center text-sm font-semibold text-foreground"
        >
          {brand}
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {links.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <Link
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {rightSlot}
          <ThemeBuilderTrigger />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
