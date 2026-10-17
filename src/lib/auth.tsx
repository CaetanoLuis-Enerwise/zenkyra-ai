"use client";

/**
 * Live-mode auth context: holds the API client, the JWT (localStorage) and the
 * current user/tenant. Any 401 from the API clears the token and sends the user to /login.
 */

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import { createApiClient, type ApiClient, type TenantOut, type UserOut } from "@/lib/api-client";

type Status = "loading" | "anonymous" | "authenticated";

interface AuthState {
  api: ApiClient;
  status: Status;
  user: UserOut | null;
  tenant: TenantOut | null;
  login: (email: string, password: string) => Promise<void>;
  setPassword: (token: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthState | null>(null);

/** Only allow same-origin relative paths as post-login targets. */
export function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/overview";
  if (next.startsWith("/login") || next.startsWith("/set-password")) return "/overview";
  return next;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathRef = React.useRef(pathname);
  pathRef.current = pathname;

  const [status, setStatus] = React.useState<Status>("loading");
  const [user, setUser] = React.useState<UserOut | null>(null);
  const [tenant, setTenant] = React.useState<TenantOut | null>(null);

  const api = React.useMemo(
    () =>
      createApiClient({
        baseUrl: API_URL,
        onUnauthorized: () => {
          setUser(null);
          setTenant(null);
          setStatus("anonymous");
          const p = pathRef.current ?? "";
          if (!p.startsWith("/login") && !p.startsWith("/set-password")) {
            router.replace(`/login?next=${encodeURIComponent(p || "/overview")}`);
          }
        },
      }),
    [router]
  );

  const loadSession = React.useCallback(async () => {
    if (!api.isAuthenticated()) {
      setStatus("anonymous");
      return;
    }
    try {
      const [u, t] = await Promise.all([api.me(), api.tenant()]);
      setUser(u);
      setTenant(t);
      setStatus("authenticated");
    } catch (e) {
      // 401 is handled by onUnauthorized; any other failure (API down) keeps the token
      // but cannot show tenant data, so treat as anonymous for gating.
      if (!(e && typeof e === "object" && "status" in e && (e as { status: number }).status === 401)) {
        setStatus("anonymous");
      }
    }
  }, [api]);

  React.useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const value: AuthState = {
    api,
    status,
    user,
    tenant,
    login: async (email, password) => {
      await api.login(email, password);
      await loadSession();
    },
    setPassword: async (token, password) => {
      await api.setPassword(token, password);
      await loadSession();
    },
    logout: () => {
      api.logout();
      setUser(null);
      setTenant(null);
      setStatus("anonymous");
      router.replace("/login");
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider> (live mode only)");
  return ctx;
}
