"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoDialog } from "@/components/marketing/demo-dialog";

export function MobileCtaBar() {
  const open = useDemoDialog((s) => s.openDialog);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="border-t border-border bg-background/90 backdrop-blur-xl">
        <div className="container flex items-center gap-2 py-2.5">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => open("mobile-bar")}
          >
            <CalendarCheck className="h-4 w-4" />
            Book Executive Demo
          </Button>
          <Button size="sm" variant="outline" asChild className="flex-1">
            <Link href="/onboarding">Free pilot</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
