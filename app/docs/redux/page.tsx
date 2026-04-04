import type { Metadata } from "next"
import Content from "./content.mdx"

export const metadata: Metadata = {
  title: "Redux Setup — Store with localStorage Persistence",
  description:
    "Drop-in Redux store configuration using react-redux-methods. Includes localStorage persistence helpers, Redux DevTools support, and ready-to-use notification and todo slice examples.",
  alternates: { canonical: "https://formkitcn.pro/docs/redux" },
  openGraph: {
    title: "Redux Setup — FormKitCN Docs",
    description:
      "Drop-in Redux store with localStorage persistence, DevTools support, and pre-built slices.",
    url: "https://formkitcn.pro/docs/redux",
  },
}

export default function ReduxPage() {
  return <Content />
}
