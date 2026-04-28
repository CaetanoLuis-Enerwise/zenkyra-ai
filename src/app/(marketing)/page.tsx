import { Hero } from "@/components/marketing/hero";
import { Logos } from "@/components/marketing/logos";
import { OutcomeStrip } from "@/components/marketing/outcome-strip";
import { AgentsShowcase } from "@/components/marketing/agents-showcase";
import { Benefits } from "@/components/marketing/benefits";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { BuyingCommittee } from "@/components/marketing/buying-committee";
import { UseCases } from "@/components/marketing/use-cases";
import { RoiSnapshot } from "@/components/marketing/roi-snapshot";
import { Comparison } from "@/components/marketing/comparison";
import { Testimonial } from "@/components/marketing/testimonial";
import { WeekTimeline } from "@/components/marketing/week-timeline";
import { PricingTeaser } from "@/components/marketing/pricing-teaser";
import { Faq } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Logos />
      <OutcomeStrip />
      <AgentsShowcase />
      <Benefits />
      <BuyingCommittee />
      <HowItWorks />
      <UseCases />
      <RoiSnapshot />
      <Comparison />
      <Testimonial />
      <WeekTimeline />
      <PricingTeaser />
      <Faq />
      <FinalCTA />
    </>
  );
}
