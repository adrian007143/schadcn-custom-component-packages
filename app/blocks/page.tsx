import type { Metadata } from "next"
import BlocksBrowser from "./BlocksBrowser"

export const metadata: Metadata = {
  title: "Component Registry — shadcn/ui Blocks",
  description:
    "Browse all FormKitCN registry blocks. 7 installable components covering dynamic forms, multi-step forms, form layouts, editable data tables, and Redux state management. Install any block with one npx shadcn CLI command.",
  alternates: {
    canonical: "https://formkitcn.pro/blocks",
  },
  openGraph: {
    title: "FormKitCN Registry — Browse All Blocks",
    description:
      "7 installable shadcn/ui blocks for React. Forms, data tables, and Redux — one CLI command each.",
    url: "https://formkitcn.pro/blocks",
  },
}

export default function BlocksPage() {
  return <BlocksBrowser />
}
