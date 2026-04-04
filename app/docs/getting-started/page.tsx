import type { Metadata } from "next"
import Content from "./content.mdx"

export const metadata: Metadata = {
  title: "Getting Started — Install Your First Block",
  description:
    "Install FormKitCN components in your Next.js project in under a minute. Requires Next.js 13+, React 18+, TypeScript, Tailwind CSS, and an initialized shadcn/ui project.",
  alternates: { canonical: "https://formkitcn.pro/docs/getting-started" },
  openGraph: {
    title: "Getting Started — FormKitCN Docs",
    description:
      "Install FormKitCN blocks in your Next.js project with one npx shadcn CLI command.",
    url: "https://formkitcn.pro/docs/getting-started",
  },
}

export default function GettingStartedPage() {
  return <Content />
}
