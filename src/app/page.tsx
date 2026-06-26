import { CtaFinal } from "./_components/landing/cta-final";
import { DashboardDetail } from "./_components/landing/dashboard-detail";
import { Faq } from "./_components/landing/faq";
import { FeaturesBento } from "./_components/landing/features-bento";
import { LandingFooter } from "./_components/landing/footer";
import { Hero } from "./_components/landing/hero";
import { HowItWorks } from "./_components/landing/how-it-works";
import { LandingNav } from "./_components/landing/nav";
import { PricingSimple } from "./_components/landing/pricing-simple";
import { ProblemSolution } from "./_components/landing/problem-solution";
import { Roi } from "./_components/landing/roi";
import { SocialProof } from "./_components/landing/social-proof";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <ProblemSolution />
        <FeaturesBento />
        <HowItWorks />
        <DashboardDetail />
        <Roi />
        <PricingSimple />
        <Faq />
        <CtaFinal />
      </main>
      <LandingFooter />
    </div>
  );
}
