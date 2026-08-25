"use client";

import { useCallback, useEffect, useState } from "react";

import { errorMessage } from "@/lib/api/errors";

interface Outcome<T> {
  /** Which request this result belongs to. */
  key: string;
  data: T | null;
  error: string | null;
}

/**
 * Fetch-on-mount with the three states every view in this app needs.
 *
 * Two React 19 rules shape this hook, and both are worth understanding before
 * changing it:
 *
 *   - `react-hooks/set-state-in-effect` forbids setting state synchronously in
 *     an effect body. So `loading` is *derived* — a result is stamped with the
 *     key of the request that produced it, and anything whose key doesn't match
 *     the current one is still in flight. No setState needed to start loading.
 *
 *   - `react-hooks/refs` forbids mutating a ref during render, which rules out
 *     the usual "latest loader in a ref" trick. Instead `loader` is simply
 *     called inside the effect, so it picks up the closure from the render that
 *     last changed `deps`.
 *
 * `deps` must therefore be JSON-serialisable — in practice ids, slugs and
 * filter strings, which is all any caller here passes.
 */
export function useAsync<T>(
  loader: () => Promise<T>,
  deps: readonly unknown[] = [],
  fallbackMessage = "Something went wrong",
) {
  const [reloadToken, setReloadToken] = useState(0);
  const key = `${JSON.stringify(deps)}:${reloadToken}`;

  const [outcome, setOutcome] = useState<Outcome<T>>({
    key: "",
    data: null,
    error: null,
  });

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let active = true;

    loader()
      .then((data) => {
        if (active) setOutcome({ key, data, error: null });
      })
      .catch((caught: unknown) => {
        if (active) {
          setOutcome({ key, data: null, error: errorMessage(caught, fallbackMessage) });
        }
      });

    return () => {
      // Drop the result of a request whose component has already moved on.
      active = false;
    };
    // `loader` is intentionally excluded — it is a fresh closure every render,
    // and `key` already encodes everything that should trigger a refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, fallbackMessage]);

  const settled = outcome.key === key;

  return {
    data: settled ? outcome.data : null,
    error: settled ? outcome.error : null,
    loading: !settled,
    reload,
  };
}
