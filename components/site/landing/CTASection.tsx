import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-10 md:p-16 text-center">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-violet-500/10 rounded-full blur-2xl -z-10" />
          <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-2xl -z-10" />

          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to build faster?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Start with the getting-started guide or jump straight into the
              component registry. Everything is open source and free to use.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" asChild className="gap-2 h-11 px-6 shadow-md">
                <Link href="/docs/getting-started">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-11 px-6 gap-2">
                <Link href="/blocks">
                  Browse Blocks
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="h-11 px-6 gap-2">
                <a
                  href="https://github.com/adrian007143/schadcn-custom-component-packages"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
