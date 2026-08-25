import Link from "next/link";

import { LogoMark } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Permanently dark in both themes — hence bg-ink-dark and literal white text
 * rather than the theme-aware tokens.
 */
export function Footer() {
  return (
    <footer className="bg-ink-dark">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-[17px] font-bold tracking-tight text-white">
                Agri<span className="text-brand-400">Scan</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-200/70">
              Crop diagnostics from a photograph. Built for farmers who need an
              answer in the field, not a lab report next week.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterColumn
              title="Product"
              links={[
                { href: "/scan", label: "Scan a leaf" },
                { href: "/crops", label: "Crop library" },
                { href: "/dashboard", label: "Dashboard" },
              ]}
            />
            <FooterColumn
              title="Account"
              links={[
                { href: "/login", label: "Sign in" },
                { href: "/register", label: "Create account" },
              ]}
            />
            <FooterColumn
              title="More"
              links={[
                { href: "#how", label: "How it works" },
                { href: "#ai", label: "The AI" },
              ]}
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-brand-200/50">
            © {new Date().getFullYear()} AgriScan. All rights reserved.
          </p>
          <ThemeToggle tone="onDark" />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-brand-200/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
