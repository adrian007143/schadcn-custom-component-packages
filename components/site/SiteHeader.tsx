import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { ThemeBuilderTrigger } from "@/components/theme/ThemeBuilderTrigger"
import { Button } from "@/components/ui/button"
import { FormKitCNLogo } from "./FormKitCNLogo"

const NAV_LINKS = [
  { href: "/blocks", label: "Components" },
  { href: "/docs/getting-started", label: "Docs" },
  { href: "/blocks/dynamic-form-field", label: "Examples" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center">
          <FormKitCNLogo size={28} textClassName="text-base" />
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com/adrian007143/schadcn-custom-component-packages"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
          </Button>
          <ThemeBuilderTrigger />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
