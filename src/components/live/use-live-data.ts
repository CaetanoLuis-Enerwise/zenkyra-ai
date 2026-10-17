"use client";

import * as React from "react";
import { ApiError } from "@/lib/api-client";

export interface LiveData<T> {
  data: T | null;
  error: ApiError | Error | null;
  loading: boolean;
  reload: () => void;
}

/** Minimal fetch-on-mount hook for live-mode pages. */
export function useLiveData<T>(load: () => Promise<T>, deps: React.DependencyList = []): LiveData<T> {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<ApiError | Error | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    load()
      .then((d) => {
        if (!alive) return;
        setData(d);
        setError(null);
      })
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);

  return { data, error, loading, reload: () => setTick((t) => t + 1) };
}

export const DASH = "—";

export function fmtInt(n: number | null | undefined): string {
  return typeof n === "number" && Number.isFinite(n) ? n.toLocaleString("en-GB") : DASH;
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return DASH;
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? DASH
    : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtBytes(n: number | null | undefined): string {
  if (typeof n !== "number") return DASH;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
