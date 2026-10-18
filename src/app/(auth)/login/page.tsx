import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LIVE_MODE } from "@/lib/config";
import { LoginForm } from "@/components/live/login-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function LoginPage() {
  if (!LIVE_MODE) notFound();
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
