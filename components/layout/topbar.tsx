"use client";

import Link from "next/link";
import { ScanLine } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { LogoMark } from "@/components/ui/logo";

export function Topbar({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-page/85 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-5 py-4 lg:px-8">
        <Link href="/dashboard" className="lg:hidden">
          <LogoMark className="h-8 w-8" />
        </Link>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold tracking-tight text-ink lg:text-xl">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 truncate text-sm text-body">{description}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {action}
          <Link
            href="/scan"
            className="hidden h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-[#03150D] transition-colors hover:bg-brand-400 sm:inline-flex lg:hidden xl:inline-flex"
          >
            <ScanLine className="h-4 w-4" />
            New scan
          </Link>
          <span className="lg:hidden">
            <ThemeToggle />
          </span>
        </div>
      </div>
    </header>
  );
}
