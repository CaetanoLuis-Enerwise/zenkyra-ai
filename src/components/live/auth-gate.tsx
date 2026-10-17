"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth";

function Gate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (status === "anonymous") {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/overview")}`);
    }
  }, [status, router, pathname]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted-foreground" role="status">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {status === "loading" ? "Checking your session…" : "Redirecting to sign in…"}
      </div>
    );
  }
  return <>{children}</>;
}

/** Live mode only: requires a valid JWT before rendering the app shell. */
export function AuthGate({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Gate>{children}</Gate>
    </AuthProvider>
  );
}
