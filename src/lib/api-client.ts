/**
 * Typed client for the Zenkyra FastAPI backend (backend/app/api/v1, backend/app/schemas).
 * Only used in live mode (NEXT_PUBLIC_API_URL set); mock mode keeps using src/lib/api.ts.
 *
 * Auth: the JWT from /auth/login or /auth/set-password is kept in localStorage and sent as
 * `Authorization: Bearer <jwt>`. Any 401 on an authenticated call clears it and calls
 * `onUnauthorized` (the auth context redirects to /login). See README "Live mode" for the
 * XSS trade-off of localStorage.
 */

export const TOKEN_STORAGE_KEY = "zenkyra.jwt";
export const API_PREFIX = "/api/v1";
/** Mirrors backend/app/api/v1/documents.py MAX_UPLOAD_MB. */
export const MAX_UPLOAD_MB = 25;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

// ---- Schemas (backend/app/schemas/__init__.py, backend/app/models) ----

export type UserRole = "owner" | "admin" | "member";
export type DocumentStatus = "pending" | "processing" | "ready" | "failed";

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
export interface UserOut {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  tenant_id: string;
}
export interface TenantOut {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}
export interface DocumentOut {
  id: string;
  filename: string;
  status: DocumentStatus;
  chunk_count: number;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
}
export interface ChatMessageResponse {
  conversation_id: string;
  reply: string;
}
export interface ChatHistoryMessage {
  role: "user" | "assistant" | string;
  content: string;
  created_at: string;
}
export interface AnalyticsSummary {
  tasks_completed: number;
  hours_saved_estimate: number;
  llm_calls_trailing_30d: number;
}
export interface BillingPlan {
  slug: string;
  name: string;
  price_display: string;
  highlights: string[];
}
export interface TenantBillingOut {
  plan_slug: string;
  stripe_customer_id: string | null;
  pilot_ends_at: string | null;
}

// ---- Errors ----

export type ApiErrorKind =
  | "network"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "too_large"
  | "validation"
  | "bad_request"
  | "unavailable"
  | "server"
  | "client";

export class ApiError extends Error {
  readonly status: number;
  readonly kind: ApiErrorKind;
  readonly detail: unknown;
  constructor(status: number, kind: ApiErrorKind, message: string, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.kind = kind;
    this.detail = detail;
  }
}

export function kindForStatus(status: number): ApiErrorKind {
  if (status === 0) return "network";
  if (status === 400) return "bad_request";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 413) return "too_large";
  if (status === 422) return "validation";
  if (status === 503) return "unavailable";
  if (status >= 500) return "server";
  return "client";
}

/** FastAPI errors: {"detail": "text"} or {"detail": [{loc, msg, ...}]} (422). */
export function messageFromDetail(detail: unknown, fallback: string): string {
  if (typeof detail === "string" && detail) return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((d) => {
        if (d && typeof d === "object" && "msg" in d) {
          const loc = Array.isArray((d as { loc?: unknown[] }).loc)
            ? (d as { loc: unknown[] }).loc.filter((p) => p !== "body").join(".")
            : "";
          return loc ? `${loc}: ${(d as { msg: string }).msg}` : (d as { msg: string }).msg;
        }
        return String(d);
      })
      .join("; ");
  }
  return fallback;
}

// ---- Token storage ----

export interface TokenStore {
  get(): string | null;
  set(token: string): void;
  clear(): void;
}

export function localStorageTokenStore(key = TOKEN_STORAGE_KEY): TokenStore {
  const ls = () => (typeof window === "undefined" ? null : window.localStorage);
  return {
    get: () => ls()?.getItem(key) ?? null,
    set: (t) => ls()?.setItem(key, t),
    clear: () => ls()?.removeItem(key),
  };
}

// ---- Client ----

export interface ApiClientOptions {
  baseUrl: string;
  tokens?: TokenStore;
  fetchImpl?: typeof fetch;
  onUnauthorized?: () => void;
}

interface RequestOpts {
  method?: string;
  json?: unknown;
  form?: FormData;
  auth?: boolean;
}

export function createApiClient(opts: ApiClientOptions) {
  const base = opts.baseUrl.trim().replace(/\/+$/, "");
  const tokens = opts.tokens ?? localStorageTokenStore();
  const doFetch: typeof fetch = (...a) => (opts.fetchImpl ?? fetch)(...a);

  async function request<T>(path: string, { method = "GET", json, form, auth = true }: RequestOpts = {}): Promise<T> {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (json !== undefined) headers["Content-Type"] = "application/json";
    if (auth) {
      const t = tokens.get();
      if (!t) {
        opts.onUnauthorized?.();
        throw new ApiError(401, "unauthorized", "Not signed in");
      }
      headers.Authorization = `Bearer ${t}`;
    }

    let res: Response;
    try {
      res = await doFetch(`${base}${API_PREFIX}${path}`, {
        method,
        headers,
        body: form ?? (json !== undefined ? JSON.stringify(json) : undefined),
      });
    } catch (e) {
      throw new ApiError(0, "network", "Cannot reach the Zenkyra API", e);
    }

    if (res.status === 204) return undefined as T;

    let body: unknown = null;
    const text = await res.text();
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    if (!res.ok) {
      const detail = body && typeof body === "object" && "detail" in body ? (body as { detail: unknown }).detail : body;
      const kind = kindForStatus(res.status);
      if (res.status === 401 && auth) {
        tokens.clear();
        opts.onUnauthorized?.();
      }
      throw new ApiError(res.status, kind, messageFromDetail(detail, `Request failed (${res.status})`), detail);
    }
    return body as T;
  }

  return {
    tokens,
    isAuthenticated: () => !!tokens.get(),
    logout: () => tokens.clear(),

    async login(email: string, password: string): Promise<TokenResponse> {
      const r = await request<TokenResponse>("/auth/login", { method: "POST", json: { email, password }, auth: false });
      tokens.set(r.access_token);
      return r;
    },
    async setPassword(token: string, password: string): Promise<TokenResponse> {
      const r = await request<TokenResponse>("/auth/set-password", { method: "POST", json: { token, password }, auth: false });
      tokens.set(r.access_token);
      return r;
    },
    me: () => request<UserOut>("/auth/me"),
    tenant: () => request<TenantOut>("/tenants/me"),
    billingCurrent: () => request<TenantBillingOut>("/billing/current"),
    billingPlans: () => request<BillingPlan[]>("/billing/plans", { auth: false }),
    analyticsSummary: () => request<AnalyticsSummary>("/analytics/summary"),

    listDocuments: () => request<DocumentOut[]>("/documents"),
    async uploadDocument(file: File | Blob, filename?: string): Promise<DocumentOut> {
      if (file.size > MAX_UPLOAD_BYTES) {
        throw new ApiError(413, "too_large", `File exceeds ${MAX_UPLOAD_MB}MB`);
      }
      const form = new FormData();
      form.append("file", file, filename ?? (file as File).name ?? "upload");
      return request<DocumentOut>("/documents", { method: "POST", form });
    },
    deleteDocument: (id: string) => request<void>(`/documents/${encodeURIComponent(id)}`, { method: "DELETE" }),

    sendChatMessage: (message: string, conversationId?: string | null) =>
      request<ChatMessageResponse>("/chat/messages", {
        method: "POST",
        json: { message, conversation_id: conversationId ?? null },
      }),
    conversationMessages: (conversationId: string) =>
      request<ChatHistoryMessage[]>(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
