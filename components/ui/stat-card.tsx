import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  tone?: "default" | "brand" | "warn" | "err";
  className?: string;
}) {
  const tones = {
    default: "text-ink",
    brand: "text-accent-link",
    warn: "text-warn",
    err: "text-err",
  };
  const iconTones = {
    default: "bg-inset text-subtle",
    brand: "bg-brand-softer text-accent-link",
    warn: "bg-warn-soft text-warn",
    err: "bg-err-soft text-err",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-surface p-5 shadow-sm transition-colors hover:border-line-strong",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-faint">{label}</p>
        {icon && (
          <span className={cn("grid h-8 w-8 place-items-center rounded-lg", iconTones[tone])}>
            {icon}
          </span>
        )}
      </div>
      <p className={cn("mt-3 font-mono text-3xl font-bold tabular-nums", tones[tone])}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-subtle">{hint}</p>}
    </div>
  );
}
