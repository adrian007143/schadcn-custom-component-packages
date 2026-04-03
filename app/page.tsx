import { HeroSection } from "@/components/site/landing/HeroSection"
import { FeaturesSection } from "@/components/site/landing/FeaturesSection"
import { HowItWorksSection } from "@/components/site/landing/HowItWorksSection"
import { BlocksPreviewSection } from "@/components/site/landing/BlocksPreviewSection"
import { FieldTypesSection } from "@/components/site/landing/FieldTypesSection"
import { CTASection } from "@/components/site/landing/CTASection"
import { getBaseUrl } from "@/lib/site-url.server"

export default async function HomePage() {
  const baseUrl = await getBaseUrl()

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection baseUrl={baseUrl} />
      <BlocksPreviewSection />
      <FieldTypesSection />
      <CTASection />
    </>
  )
}
