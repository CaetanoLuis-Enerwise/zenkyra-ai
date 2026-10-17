/** Pure logic for /set-password (tested in tests/set-password.test.ts). */

// backend SetPasswordRequest: token 16..256 chars, password >= 8 chars.
export const MIN_PASSWORD = 8;
export const TOKEN_MIN = 16;
export const TOKEN_MAX = 256;

export function readToken(search: URLSearchParams | string | null | undefined): string | null {
  if (search == null) return null;
  const p = typeof search === "string" ? new URLSearchParams(search) : search;
  const t = (p.get("token") ?? "").trim();
  if (t.length < TOKEN_MIN || t.length > TOKEN_MAX) return null;
  return t;
}

export function validatePasswords(password: string, confirm: string): string | null {
  if (password.length < MIN_PASSWORD) return `Use at least ${MIN_PASSWORD} characters.`;
  if (password !== confirm) return "The two passwords do not match.";
  return null;
}

/** Maps a set-password API failure to user-facing text. */
export function setPasswordErrorMessage(err: unknown): string {
  const e = err as { status?: number; kind?: string } | null;
  if (e?.status === 400) return "This link is invalid, expired or already used. Ask us for a new link.";
  if (e?.status === 422) return "The password or link was rejected by the server. Check it and try again.";
  if (e?.kind === "network") return "Cannot reach the Zenkyra API. Try again in a moment.";
  return "Something went wrong. Try again.";
}
