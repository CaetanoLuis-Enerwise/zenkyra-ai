/**
 * Build-time mode switch. NEXT_PUBLIC_* values are inlined by Next.js at build time.
 *
 * - NEXT_PUBLIC_API_URL unset/empty → mock mode: the app pages render src/lib/mock-data.ts
 *   behind the "Demo data" banner, exactly like production today. No login gate.
 * - NEXT_PUBLIC_API_URL set → live mode: the app shell requires a JWT and talks to the
 *   FastAPI backend at that URL (e.g. https://api.example.com, without /api/v1).
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/+$/, "");
export const LIVE_MODE = API_URL.length > 0;
