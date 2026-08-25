"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Images, LayoutDashboard, ScanLine, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/scans", label: "History", icon: Images },
  { href: "/scan", label: "Scan", icon: ScanLine, primary: true },
  { href: "/crops", label: "Crops", icon: BookOpen },
  { href: "/settings", label: "You", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-xl lg:hidden">
      <ul className="flex items-stretch justify-around px-2 py-1.5">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          if (item.primary) {
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex flex-col items-center gap-1 px-3 py-1"
                  aria-label={item.label}
                >
                  <span className="grid h-11 w-11 -translate-y-3 place-items-center rounded-2xl bg-brand-500 text-[#03150D] shadow-[0_8px_20px_-8px_rgba(22,193,114,0.9)]">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="-mt-2 text-[10px] font-medium text-accent-link">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          }
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-[10px] font-medium transition-colors",
                  active ? "text-accent-link" : "text-subtle",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
