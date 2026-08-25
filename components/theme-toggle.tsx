"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { useHydrated } from "@/lib/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "onDark";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const isDark = resolvedTheme === "dark";
  const label = !hydrated
    ? "Toggle theme"
    : isDark
      ? "Switch to light mode"
      : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={hydrated ? label : undefined}
      className={cn(
        "rounded-full p-2 transition-colors",
        tone === "onDark"
          ? "text-brand-200 hover:bg-white/10 hover:text-white"
          : "text-body hover:bg-brand-soft hover:text-accent-link",
        className,
      )}
    >
      {hydrated && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
