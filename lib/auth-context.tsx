"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import * as authApi from "@/lib/api/auth";
import { tokens } from "@/lib/api/client";
import type { User } from "@/lib/api/types";

interface AuthValue {
  user: User | null;
  /** True until the stored token has been checked — gate redirects on this. */
  loading: boolean;
  isAgronomist: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: authApi.RegisterPayload) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    // Wrapped in an async function so the settle always lands in a microtask.
    // Bailing out with a synchronous setLoading(false) here would trip React
    // 19's set-state-in-effect rule.
    const resolveSession = async () => {
      // A token in storage isn't proof of a valid session — ask the server.
      if (!tokens.access()) return null;
      try {
        return await authApi.fetchMe();
      } catch {
        tokens.clear();
        return null;
      }
    };

    resolveSession().then((me) => {
      if (!active) return;
      setUser(me);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const me = await authApi.login(email, password);
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (payload: authApi.RegisterPayload) => {
    const created = await authApi.register(payload);
    await authApi.login(payload.email, payload.password);
    const me = await authApi.fetchMe();
    setUser(me);
    return created;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    router.push("/login");
  }, [router]);

  const refresh = useCallback(async () => {
    setUser(await authApi.fetchMe());
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      isAgronomist: user?.role === "AGRONOMIST",
      login,
      register,
      logout,
      refresh,
    }),
    [user, loading, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
