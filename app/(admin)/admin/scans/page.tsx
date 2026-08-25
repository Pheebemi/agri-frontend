"use client";

import { useState } from "react";
import { Filter } from "lucide-react";

import { Topbar } from "@/components/layout/topbar";
import { ScanRow } from "@/components/scan/scan-row";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { RowSkeleton } from "@/components/ui/skeleton";
import { listScans } from "@/lib/api/scans";
import { useAsync } from "@/lib/hooks/use-async";
import { SEVERITY_ORDER, SEVERITY_STYLES } from "@/lib/severity";
import { cn } from "@/lib/utils";

const STATUSES = [
  { value: "", label: "All" },
  { value: "COMPLETE", label: "Complete" },
  { value: "NEEDS_REVIEW", label: "Needs review" },
  { value: "FAILED", label: "Failed" },
];

export default function AdminScansPage() {
  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");

  const { data, loading, error, reload } = useAsync(
    () => listScans({ status: status || undefined, severity: severity || undefined }),
    [status, severity],
    "Couldn't load scans",
  );

  return (
    <>
      <Topbar
        title="All scans"
        description={
          data ? `${data.count} ${data.count === 1 ? "scan" : "scans"} across every user` : undefined
        }
      />

      <div className="p-5 lg:p-8">
        <div className="mb-5 space-y-3">
          <FilterRow label="Status">
            {STATUSES.map((option) => (
              <FilterChip
                key={option.value}
                active={status === option.value}
                onClick={() => setStatus(option.value)}
              >
                {option.label}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label="Severity">
            <FilterChip active={severity === ""} onClick={() => setSeverity("")}>
              All
            </FilterChip>
            {SEVERITY_ORDER.map((level) => (
              <FilterChip
                key={level}
                active={severity === level}
                activeClass={SEVERITY_STYLES[level].chip}
                onClick={() => setSeverity(severity === level ? "" : level)}
              >
                {SEVERITY_STYLES[level].label}
              </FilterChip>
            ))}
          </FilterRow>
        </div>

        {loading ? (
          <RowSkeleton count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : data?.results.length ? (
          <div className="space-y-2">
            {data.results.map((scan) => (
              <ScanRow key={scan.id} scan={scan} showOwner />
            ))}
          </div>
        ) : (
          <Card>
            <CardBody>
              <EmptyState
                illustration="no-data"
                title="Nothing matches those filters"
                description="Try widening the status or severity filter."
              />
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex w-20 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-faint">
        <Filter className="h-3.5 w-3.5" />
        {label}
      </span>
      {children}
    </div>
  );
}

function FilterChip({
  active,
  activeClass,
  onClick,
  children,
}: {
  active: boolean;
  activeClass?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? (activeClass ?? "border-brand-400/30 bg-brand-softer text-accent-link")
          : "border-line-strong text-subtle hover:border-brand-400/40 hover:text-accent-link",
      )}
    >
      {children}
    </button>
  );
}
