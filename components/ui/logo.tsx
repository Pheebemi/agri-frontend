import Link from "next/link";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
        "bg-gradient-to-br from-brand-400 to-brand-700 text-[#04150D]",
        "shadow-[0_0_0_1px_rgba(52,216,139,0.25),0_8px_24px_-12px_rgba(22,193,114,0.8)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  tone = "default",
  href = "/",
  showTagline = false,
}: {
  className?: string;
  tone?: "default" | "onDark";
  href?: string;
  showTagline?: boolean;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "text-[17px] font-bold tracking-tight",
            tone === "onDark" ? "text-white" : "text-ink",
          )}
        >
          Agri<span className="text-brand-400">Scan</span>
        </span>
        {showTagline && (
          <span className="text-[11px] text-faint">Crop diagnostics</span>
        )}
      </span>
    </Link>
  );
}
