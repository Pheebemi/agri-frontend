"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Images,
  LayoutDashboard,
  LogOut,
  ScanLine,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { LogoMark } from "@/components/ui/logo";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const FARMER_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scan", label: "New scan", icon: ScanLine },
  { href: "/scans", label: "Scan history", icon: Images },
  { href: "/crops", label: "Crop library", icon: BookOpen },
  { href: "/farms", label: "Farms", icon: Wallet },
];

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/scans", label: "All scans", icon: Images },
  { href: "/admin/review", label: "Review queue", icon: ClipboardCheck },
  { href: "/admin/users", label: "Users", icon: Users },
];

/**
 * Permanently dark in both themes — an operator moving between the app and the
 * Django admin shouldn't see the furniture change colour. Hence bg-ink-dark and
 * tone="onDark" on the toggle.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { user, isAgronomist, logout } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-ink-dark lg:flex">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <LogoMark />
        <span className="text-[17px] font-bold tracking-tight text-white">
          Agri<span className="text-brand-400">Scan</span>
        </span>
      </div>

      <nav className="scroll-slim flex-1 overflow-y-auto px-3 py-4">
        <NavGroup title="Farming" items={FARMER_NAV} pathname={pathname} />
        {isAgronomist && (
          <NavGroup
            title="Agronomist"
            items={ADMIN_NAV}
            pathname={pathname}
            className="mt-6"
          />
        )}
      </nav>

      <div className="border-t border-white/5 p-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/5",
            pathname === "/settings" && "bg-white/5",
          )}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-300">
            {user?.initials ?? "··"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-white">
              {user?.full_name || user?.email || "Loading…"}
            </span>
            <span className="block truncate text-[11px] text-brand-200/55">
              {isAgronomist ? "Agronomist" : "Farmer"}
            </span>
          </span>
          <Settings className="h-4 w-4 shrink-0 text-brand-200/50" />
        </Link>

        <div className="mt-2 flex items-center gap-1">
          <button
            type="button"
            onClick={logout}
            className="flex flex-1 items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-brand-200/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <ThemeToggle tone="onDark" />
        </div>
      </div>
    </aside>
  );
}

function NavGroup({
  title,
  items,
  pathname,
  className,
}: {
  title: string;
  items: { href: string; label: string; icon: React.ElementType }[];
  pathname: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-brand-200/40">
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          // "/scans" must not light up for "/scan" — compare the segment, not a prefix.
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-500/15 text-brand-300"
                    : "text-brand-200/65 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
