import { describe, expect, it, vi } from "vitest";
import {
  ApiError,
  MAX_UPLOAD_BYTES,
  createApiClient,
  kindForStatus,
  messageFromDetail,
  type TokenStore,
} from "./api-client";

function memStore(initial: string | null = null): TokenStore & { value: string | null } {
  const s = {
    value: initial,
    get: () => s.value,
    set: (t: string) => {
      s.value = t;
    },
    clear: () => {
      s.value = null;
    },
  };
  return s;
}

function jsonResponse(status: number, body: unknown) {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function setup(token: string | null, responder: (url: string, init: RequestInit) => Response | Promise<Response>) {
  const tokens = memStore(token);
  const onUnauthorized = vi.fn();
  const fetchImpl = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => responder(String(url), init ?? {}));
  const api = createApiClient({ baseUrl: "http://api.test/", tokens, fetchImpl: fetchImpl as unknown as typeof fetch, onUnauthorized });
  return { api, tokens, onUnauthorized, fetchImpl };
}

describe("api-client auth header", () => {
  it("sends Bearer token to /api/v1 under the base URL (trailing slash trimmed)", async () => {
    const { api, fetchImpl } = setup("jwt-123", () =>
      jsonResponse(200, { tasks_completed: 0, hours_saved_estimate: 0, llm_calls_trailing_30d: 0 })
    );
    const r = await api.analyticsSummary();
    expect(r.tasks_completed).toBe(0);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("http://api.test/api/v1/analytics/summary");
    expect((init!.headers as Record<string, string>).Authorization).toBe("Bearer jwt-123");
  });

  it("login sends no Authorization header and stores the returned token", async () => {
    const { api, tokens, fetchImpl } = setup(null, () => jsonResponse(200, { access_token: "new-jwt", token_type: "bearer" }));
    await api.login("a@b.co", "secret-pass");
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("http://api.test/api/v1/auth/login");
    expect((init!.headers as Record<string, string>).Authorization).toBeUndefined();
    expect(JSON.parse(String(init!.body))).toEqual({ email: "a@b.co", password: "secret-pass" });
    expect(tokens.value).toBe("new-jwt");
  });

  it("set-password posts {token,password} and stores the JWT", async () => {
    const { api, tokens, fetchImpl } = setup(null, () => jsonResponse(200, { access_token: "j2", token_type: "bearer" }));
    await api.setPassword("t".repeat(43), "longenough");
    expect(fetchImpl.mock.calls[0][0]).toBe("http://api.test/api/v1/auth/set-password");
    expect(JSON.parse(String(fetchImpl.mock.calls[0][1]!.body))).toEqual({ token: "t".repeat(43), password: "longenough" });
    expect(tokens.value).toBe("j2");
  });

  it("no token: fails fast with 401 and calls onUnauthorized without hitting the network", async () => {
    const { api, onUnauthorized, fetchImpl } = setup(null, () => jsonResponse(200, {}));
    await expect(api.me()).rejects.toMatchObject({ status: 401, kind: "unauthorized" });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });
});

describe("api-client 401 → logout", () => {
  it("clears the token and calls onUnauthorized on a 401 response", async () => {
    const { api, tokens, onUnauthorized } = setup("expired", () => jsonResponse(401, { detail: "Invalid token" }));
    const err = await api.listDocuments().catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).toBe("Invalid token");
    expect(tokens.value).toBeNull();
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it("a 401 from /auth/login (bad credentials) does not trigger the logout redirect", async () => {
    const { api, onUnauthorized } = setup(null, () => jsonResponse(401, { detail: "Invalid credentials" }));
    await expect(api.login("a@b.co", "wrong")).rejects.toMatchObject({ status: 401, message: "Invalid credentials" });
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it("non-401 errors keep the token", async () => {
    const { api, tokens } = setup("ok", () => jsonResponse(500, { detail: "boom" }));
    await expect(api.me()).rejects.toMatchObject({ status: 500, kind: "server" });
    expect(tokens.value).toBe("ok");
  });
});

describe("api-client error mapping", () => {
  it.each([
    [0, "network"],
    [400, "bad_request"],
    [403, "forbidden"],
    [404, "not_found"],
    [409, "conflict"],
    [413, "too_large"],
    [422, "validation"],
    [503, "unavailable"],
    [502, "server"],
    [418, "client"],
  ])("status %i → %s", (status, kind) => {
    expect(kindForStatus(status)).toBe(kind);
  });

  it("flattens FastAPI 422 detail arrays", () => {
    const detail = [{ loc: ["body", "password"], msg: "String should have at least 8 characters", type: "x" }];
    expect(messageFromDetail(detail, "fallback")).toBe("password: String should have at least 8 characters");
    expect(messageFromDetail(undefined, "fallback")).toBe("fallback");
  });

  it("network failure becomes kind=network", async () => {
    const { api } = setup("t", () => {
      throw new TypeError("fetch failed");
    });
    await expect(api.me()).rejects.toMatchObject({ status: 0, kind: "network" });
  });

  it("non-JSON error bodies still produce an ApiError", async () => {
    const { api } = setup("t", () => new Response("Bad Gateway", { status: 502 }));
    await expect(api.me()).rejects.toMatchObject({ status: 502, kind: "server", message: "Bad Gateway" });
  });

  it("DELETE 204 resolves to undefined", async () => {
    const { api, fetchImpl } = setup("t", () => new Response(null, { status: 204 }));
    await expect(api.deleteDocument("abc")).resolves.toBeUndefined();
    expect(fetchImpl.mock.calls[0][1]!.method).toBe("DELETE");
    expect(fetchImpl.mock.calls[0][0]).toBe("http://api.test/api/v1/documents/abc");
  });

  it("rejects uploads over 25MB before sending", async () => {
    const { api, fetchImpl } = setup("t", () => jsonResponse(201, {}));
    const big = new Blob([new Uint8Array(MAX_UPLOAD_BYTES + 1)]);
    await expect(api.uploadDocument(big, "big.pdf")).rejects.toMatchObject({ status: 413, kind: "too_large" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("uploads multipart without forcing a JSON content-type", async () => {
    const { api, fetchImpl } = setup("t", () => jsonResponse(201, { id: "d1" }));
    await api.uploadDocument(new Blob(["hi"], { type: "text/plain" }), "a.txt");
    const init = fetchImpl.mock.calls[0][1]!;
    expect(init.body).toBeInstanceOf(FormData);
    expect((init.headers as Record<string, string>)["Content-Type"]).toBeUndefined();
  });

  it("chat sends conversation_id (null for a new conversation)", async () => {
    const { api, fetchImpl } = setup("t", () => jsonResponse(200, { conversation_id: "c1", reply: "hi" }));
    await api.sendChatMessage("hello");
    expect(JSON.parse(String(fetchImpl.mock.calls[0][1]!.body))).toEqual({ message: "hello", conversation_id: null });
  });
});
