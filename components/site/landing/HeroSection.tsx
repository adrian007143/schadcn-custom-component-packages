import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InstallSnippet } from "./InstallSnippet"
import { getBaseUrl } from "@/lib/site-url.server"
import { buildInstallCommand } from "@/lib/site-url"
import { ArrowRight, Sparkles } from "lucide-react"

export async function HeroSection() {
  const baseUrl = await getBaseUrl()
  const installCommand = buildInstallCommand(baseUrl, "form-field.json")

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-2xl" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
          {/* Logo with glow ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl scale-150" />
            <div className="relative rounded-2xl border border-primary/20 bg-background/80 p-3 shadow-lg backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/favicon-logo.png" alt="FormKitCN" width={56} height={56} />
            </div>
          </div>

          <Badge variant="secondary" className="gap-2 px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3 w-3 text-primary" />
            Open Source · Registry-based · shadcn/ui
          </Badge>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Build production-ready forms{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                in minutes
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              A schema-driven component toolkit for React. Install any block with
              one command — dynamic form fields, multi-step forms, editable data
              tables, and Redux state management.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button size="lg" asChild className="gap-2 h-11 px-6 shadow-md">
              <Link href="/blocks">
                Browse Components
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-11 px-6">
              <Link href="/docs/getting-started">Read the Docs</Link>
            </Button>
          </div>

          <div className="w-full max-w-xl">
            <InstallSnippet command={installCommand} />
          </div>

          {/* Social proof */}
          <p className="text-xs text-muted-foreground/60">
            Free and open source · MIT License · No vendor lock-in
          </p>
        </div>
      </div>
    </section>
  )
}
