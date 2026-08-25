"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#crops", label: "Crops" },
  { href: "#ai", label: "The AI" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-page/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-body transition-colors hover:bg-brand-soft hover:text-accent-link"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link
              href={user.role === "AGRONOMIST" ? "/admin" : "/dashboard"}
              className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-[#03150D] transition-colors hover:bg-brand-400"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-xl px-4 py-2 text-sm font-medium text-body transition-colors hover:text-accent-link sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-[#03150D] transition-colors hover:bg-brand-400"
              >
                Get started
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-body md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-surface px-5 py-3 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-body hover:bg-brand-soft hover:text-accent-link"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
