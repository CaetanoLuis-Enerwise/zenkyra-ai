import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AuthProvider } from "@/lib/auth";
import { LIVE_MODE } from "@/lib/config";

// /login and /set-password only exist in live mode (NEXT_PUBLIC_API_URL set).
// In mock mode each page calls notFound(), so they stay 404 exactly like production today.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  if (!LIVE_MODE) return <>{children}</>;
  return (
    <AuthProvider>
      <div className="relative flex min-h-screen flex-col bg-background">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-30 mask-fade-b" />
        <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <Logo />
          <ThemeToggle />
        </header>
        <main className="flex flex-1 items-start justify-center px-4 py-16">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
