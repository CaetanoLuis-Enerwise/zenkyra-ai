import { MarketingNav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { DemoDialog } from "@/components/marketing/demo-dialog";
import { MobileCtaBar } from "@/components/marketing/mobile-cta-bar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNav />
      <main className="pb-16 md:pb-0">{children}</main>
      <Footer />
      <DemoDialog />
      <MobileCtaBar />
    </>
  );
}
