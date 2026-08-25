import { cn } from "@/lib/utils";

/**
 * A confidence figure with the bar underneath it.
 *
 * Low confidence is drawn in the warn colour rather than hidden, because a
 * 30%-confident diagnosis is a real result that the farmer should treat as a
 * hint. Anything under the review threshold also carries the "needs review"
 * badge elsewhere on the page.
 */
export function ConfidenceMeter({
  percent,
  label = "Model confidence",
  className,
}: {
  percent: number;
  label?: string;
  className?: string;
}) {
  const tone =
    percent >= 75 ? "bg-ok" : percent >= 55 ? "bg-brand-500" : "bg-warn";

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-subtle">{label}</span>
        <span className="font-mono text-sm font-semibold text-ink tabular-nums">
          {percent}%
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-inset">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700", tone)}
          style={{ width: `${Math.max(2, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}

/** Radial gauge used on the diagnosis report header. */
export function SeverityGauge({
  percent,
  color,
  caption,
}: {
  percent: number;
  color: string;
  caption: string;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative grid place-items-center">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          className="stroke-inset"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-xl font-bold text-ink tabular-nums">
          {clamped}%
        </span>
        <span className="text-[10px] uppercase tracking-wider text-faint">{caption}</span>
      </div>
    </div>
  );
}
