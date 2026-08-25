"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

/**
 * Toaster tied to the app's own theme rather than sonner's "system" default.
 * The app theme is a stored choice, so "system" would pop light toasts on top
 * of our dark UI for anyone whose OS is set to light.
 */
export function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      richColors
      position="top-right"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
