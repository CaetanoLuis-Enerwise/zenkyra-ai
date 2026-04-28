import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-fade-b" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/15 blur-3xl" />
      <div className="relative mb-8">
        <Logo />
      </div>
      <span className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
        <Compass className="h-3.5 w-3.5 text-brand" />
        404 · page not found
      </span>
      <h1 className="relative mt-4 max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        That page is off-shift right now.
      </h1>
      <p className="relative mt-2 max-w-md text-sm text-muted-foreground">
        The page you’re looking for has moved or never existed. Let’s get you back to your digital workforce.
      </p>
      <div className="relative mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/overview">
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Visit homepage</Link>
        </Button>
      </div>
    </main>
  );
}
