"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold " +
    "transition-all focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-brand-400 focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-page disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Near-black label on sweet green: white on this green is ~2.8:1 and
        // fails AA. See CLAUDE.md §3.1.
        primary:
          "bg-brand-500 text-[#03150D] hover:bg-brand-400 active:bg-brand-600 " +
          "shadow-[0_8px_24px_-12px_rgba(22,193,114,0.9)]",
        secondary: "bg-inset text-strong hover:bg-line border border-line-strong",
        outline:
          "border border-line-strong text-strong hover:border-brand-400 hover:text-accent-link",
        ghost: "text-body hover:bg-brand-soft hover:text-accent-link",
        danger: "bg-err-soft text-err border border-err/30 hover:bg-err/15",
        onDark: "bg-white/10 text-white hover:bg-white/20 backdrop-blur",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px]",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-[15px]",
        icon: "h-10 w-10",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  block,
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(button({ variant, size, block }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
