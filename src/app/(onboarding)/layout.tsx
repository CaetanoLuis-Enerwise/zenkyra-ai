import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-30 mask-fade-b" />
      <div className="pointer-events-none fixed -top-32 left-1/2 -z-10 h-72 w-[700px] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl" />
      <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <Logo />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Need help?</span>
          <a className="hidden font-medium text-foreground hover:underline sm:inline" href="#">
            hello@zenkyra.ai
          </a>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
