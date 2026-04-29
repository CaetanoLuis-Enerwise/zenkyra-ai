import { Hero } from "@/components/marketing/hero";
import { Logos } from "@/components/marketing/logos";
import { OutcomeStrip } from "@/components/marketing/outcome-strip";
import { WorkflowSpotlight } from "@/components/marketing/workflow-spotlight";
import { AgentsShowcase } from "@/components/marketing/agents-showcase";
import { Testimonial } from "@/components/marketing/testimonial";
import { Benefits } from "@/components/marketing/benefits";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { BuyingCommittee } from "@/components/marketing/buying-committee";
import { UseCases } from "@/components/marketing/use-cases";
import { RoiSnapshot } from "@/components/marketing/roi-snapshot";
import { Comparison } from "@/components/marketing/comparison";
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
      <WorkflowSpotlight />
      <AgentsShowcase />
      <Testimonial />
      <Benefits />
      <BuyingCommittee />
      <HowItWorks />
      <UseCases />
      <RoiSnapshot />
      <Comparison />
      <WeekTimeline />
      <PricingTeaser />
      <Faq />
      <FinalCTA />
    </>
  );
}
