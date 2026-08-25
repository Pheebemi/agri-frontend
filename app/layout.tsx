import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemedToaster } from "@/components/themed-toaster";
import { AuthProvider } from "@/lib/auth-context";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AgriScan — Crop diagnostics from a photograph",
    template: "%s · AgriScan",
  },
  description:
    "Photograph a leaf. AgriScan identifies the crop, diagnoses the disease, " +
    "and gives you a treatment plan you can act on today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning is required — next-themes writes the class on
  // <html> before paint and the server render can't know about it.
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <ThemedToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
