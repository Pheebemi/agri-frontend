import { cn } from "@/lib/utils";

/**
 * Every list view in this app needs three states: loading, empty, error.
 * This is the empty one, and it is also the error one with `tone="error"`.
 */
export function EmptyState({
  illustration = "no-data",
  title,
  description,
  action,
  className,
  compact,
}: {
  illustration?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-10" : "py-16",
        className,
      )}
    >
      <img
        src={`/illustrations/${illustration}.svg`}
        alt=""
        className={cn("mb-6 w-auto", compact ? "h-32" : "h-40")}
      />
      <p className="text-xl font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-body">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      illustration="not-found"
      title="That didn't load"
      description={message}
      action={
        onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl border border-line-strong px-4 py-2 text-sm font-medium text-strong transition-colors hover:border-brand-400 hover:text-accent-link"
          >
            Try again
          </button>
        )
      }
    />
  );
}
