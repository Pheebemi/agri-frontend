"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * False during SSR and the hydration pass, true once on the client.
 *
 * Deliberately not the usual useState(false) + useEffect(() => setMounted(true))
 * — the effect version trips React 19's react-hooks/set-state-in-effect rule.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
