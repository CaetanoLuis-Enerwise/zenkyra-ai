import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LIVE_MODE } from "@/lib/config";
import { SetPasswordForm } from "@/components/live/set-password-form";

export const metadata: Metadata = { title: "Set your password", robots: { index: false } };

export default function SetPasswordPage() {
  if (!LIVE_MODE) notFound();
  return (
    <Suspense>
      <SetPasswordForm />
    </Suspense>
  );
}
