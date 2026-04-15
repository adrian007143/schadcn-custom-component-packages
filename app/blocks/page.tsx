import type { Metadata } from "next"

import { LISTED_REGISTRY_ITEMS } from "@/lib/registry-manifest"

import BlocksBrowser from "./BlocksBrowser"

const listedBlocksCount = LISTED_REGISTRY_ITEMS.length

export const metadata: Metadata = {
  title: "Component Registry - shadcn/ui Blocks",
  description: `Browse all FormKitCN registry blocks. ${listedBlocksCount} installable components covering dynamic forms, multi-step forms, form layouts, editable data tables, and Redux state management. Install any block with one npx shadcn CLI command.`,
  alternates: {
    canonical: "https://formkitcn.pro/blocks",
  },
  openGraph: {
    title: "FormKitCN Registry - Browse All Blocks",
    description: `${listedBlocksCount} installable shadcn/ui blocks for React. Forms, data tables, and Redux - one CLI command each.`,
    url: "https://formkitcn.pro/blocks",
  },
}

export default function BlocksPage() {
  return <BlocksBrowser />
}
