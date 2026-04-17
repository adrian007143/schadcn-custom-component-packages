import type { Metadata } from "next";

import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Redux Setup - Store, Persistence, and AppProviders Integration",
  description:
    "Typed Redux setup for FormKitCN with persistence helpers, generated selectors and actions, and guidance for using AppProviders when the theme package is installed.",
  alternates: { canonical: "https://formkitcn.pro/docs/redux" },
  openGraph: {
    title: "Redux Setup - FormKitCN Docs",
    description:
      "Typed Redux store with persistence, generated selectors, and AppProviders integration guidance.",
    url: "https://formkitcn.pro/docs/redux",
  },
};

export default function ReduxPage() {
  return <Content />;
}
