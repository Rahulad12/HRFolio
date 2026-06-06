import { NavHeader } from './components/NavHeader'
import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { ScreenshotsSection } from './components/ScreenshotsSection'
import { BenefitsSection } from './components/BenefitsSection'
import { TestimonialsSection } from './components/TestimonialsSection'
import { PageFooter } from './components/PageFooter'

export function LandingPage() {
  return (
    <>
      <NavHeader />
      <HeroSection />
      <FeaturesSection />
      <ScreenshotsSection />
      <BenefitsSection />
      <TestimonialsSection />
      <PageFooter />
    </>
  )
}
