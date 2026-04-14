import type { Metadata } from "next"
import { HeroSection } from "@/components/site/landing/HeroSection"
import { FeaturesSection } from "@/components/site/landing/FeaturesSection"
import { HowItWorksSection } from "@/components/site/landing/HowItWorksSection"
import { BlocksPreviewSection } from "@/components/site/landing/BlocksPreviewSection"
import { FieldTypesSection } from "@/components/site/landing/FieldTypesSection"
import { CTASection } from "@/components/site/landing/CTASection"
import { getBaseUrl } from "@/lib/site-url.server"

export const metadata: Metadata = {
  title: "FormKitCN — Free shadcn/ui Form Components for React",
  description:
    "FormKitCN is a free, open-source registry of schema-driven React form components built on shadcn/ui. Get DynamicFormField with 17+ types, FormBuilderStandard, MultiStepForm, DynamicDataTable, and Redux setup — all installable via one npx shadcn CLI command.",
  alternates: {
    canonical: "https://formkitcn.pro",
  },
  openGraph: {
    title: "FormKitCN — Free shadcn/ui Form Components for React",
    description:
      "Schema-driven React forms built on shadcn/ui. 17+ field types, multi-step forms, data tables, Redux — install any block with one CLI command.",
    url: "https://formkitcn.pro",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FormKitCN",
  url: "https://formkitcn.pro",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "A free, open-source registry of schema-driven React form components built on shadcn/ui. Includes DynamicFormField (17+ field types), FormBuilderStandard, MultiStepForm, DynamicDataTable, and Redux store setup.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "FormKitCN",
    url: "https://formkitcn.pro",
  },
  keywords:
    "react forms, shadcn ui, form builder, react hook form, nextjs components",
  featureList: [
    "17+ dynamic form field types",
    "Schema-driven form builder",
    "Multi-step forms with Zod validation",
    "Composable form layout primitives",
    "Editable data table with drag-and-drop",
    "Redux store with localStorage persistence",
  ],
  isAccessibleForFree: true,
  license: "https://opensource.org/licenses/MIT",
}

export default function HomePage() {
  const baseUrl = getBaseUrl()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection baseUrl={baseUrl} />
      <BlocksPreviewSection />
      <FieldTypesSection />
      <CTASection />
    </>
  )
}
