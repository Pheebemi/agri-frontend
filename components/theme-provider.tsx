"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      // The app was designed dark. Light is opt-in via the toggle and the
      // choice is remembered.
      defaultTheme="dark"
      enableSystem={false}
      // Transitions on every colour token would animate the whole page on a
      // switch, which reads as a slow smear rather than a flip.
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
