"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/lib/auth-context";

/**
 * Route protection lives in the layout, not in the nav.
 *
 * Hiding a link is not protection — the backend enforces role scoping too, and
 * so should this. `requireAgronomist` sends farmers back to their own dashboard
 * rather than showing them an error they can't act on.
 */
export function AuthGuard({
  children,
  requireAgronomist = false,
}: {
  children: React.ReactNode;
  requireAgronomist?: boolean;
}) {
  const { user, loading, isAgronomist } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (requireAgronomist && !isAgronomist) {
      router.replace("/dashboard");
    }
  }, [loading, user, isAgronomist, requireAgronomist, router]);

  if (loading || !user || (requireAgronomist && !isAgronomist)) {
    return (
      <div className="grid min-h-screen place-items-center bg-page">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          <p className="text-sm text-subtle">Loading your account…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
