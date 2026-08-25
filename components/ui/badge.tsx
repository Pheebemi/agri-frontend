import { cn } from "@/lib/utils";

import type { SeverityLevel } from "@/lib/api/types";
import { severityStyle } from "@/lib/severity";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 " +
          "text-[11px] font-semibold tracking-wide",
        className,
      )}
      {...props}
    />
  );
}

export function SeverityBadge({
  severity,
  className,
  showDot = true,
}: {
  severity: SeverityLevel | "" | null;
  className?: string;
  showDot?: boolean;
}) {
  if (!severity) return null;
  const style = severityStyle(severity);
  return (
    <Badge className={cn(style.chip, className)}>
      {showDot && <span className={cn("h-1.5 w-1.5 rounded-full", style.bar)} />}
      {style.label}
    </Badge>
  );
}

const STATUS_STYLES: Record<string, string> = {
  COMPLETE: "bg-ok-soft text-ok border-ok/25",
  NEEDS_REVIEW: "bg-warn-soft text-warn border-warn/25",
  FAILED: "bg-err-soft text-err border-err/25",
  PENDING: "bg-inset text-subtle border-line-strong",
  ANALYZING: "bg-brand-softer text-accent-link border-brand-400/25",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <Badge className={STATUS_STYLES[status] ?? STATUS_STYLES.PENDING}>
      {label ?? status.replace(/_/g, " ").toLowerCase()}
    </Badge>
  );
}
