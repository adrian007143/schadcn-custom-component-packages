import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Image
            src="/images/favicon-logo.png"
            alt="FormKitCN logo"
            width={22}
            height={22}
            className="shrink-0"
            style={{ height: "auto" }}
          />
          <span className="font-semibold text-sm">
            FormKit<span className="text-primary">CN</span>
          </span>
          <span className="text-muted-foreground text-xs">v0.1.0</span>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Built with{" "}
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            shadcn/ui
          </a>
          . Open source on{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            GitHub
          </a>
          .
        </p>

        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/blocks" className="hover:text-foreground">
            Components
          </Link>
          <Link href="/docs/getting-started" className="hover:text-foreground">
            Docs
          </Link>
        </nav>
      </div>
    </footer>
  )
}
