"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { MIN_PASSWORD, readToken, setPasswordErrorMessage, validatePasswords } from "@/lib/set-password";

export function SetPasswordForm() {
  const { setPassword } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const token = readToken(params);
  const [password, setPw] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  if (!token) {
    return (
      <Card className="p-6">
        <h1 className="text-xl font-semibold tracking-tight">Link not valid</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This password link is missing its token or is malformed. Open the link from your invitation email again, or ask us for a new one.
        </p>
        <Button asChild variant="outline" className="mt-5 w-full">
          <Link href="/login">Go to sign in</Link>
        </Button>
      </Card>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validatePasswords(password, confirm);
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await setPassword(token!, password);
      router.replace("/overview");
    } catch (err) {
      setError(setPasswordErrorMessage(err));
      setBusy(false);
    }
  }

  return (
    <Card className="p-6">
      <h1 className="text-xl font-semibold tracking-tight">Set your password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        This link works once and expires 72 hours after it was issued.
      </p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="new-password">New password</Label>
          <Input id="new-password" type="password" autoComplete="new-password" minLength={MIN_PASSWORD} required value={password} onChange={(e) => setPw(e.target.value)} />
          <p className="text-xs text-muted-foreground">At least {MIN_PASSWORD} characters.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <Input id="confirm-password" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={busy || !password || !confirm}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Set password and continue
        </Button>
      </form>
    </Card>
  );
}
