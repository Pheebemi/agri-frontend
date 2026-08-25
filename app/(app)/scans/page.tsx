"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Filter } from "lucide-react";

import { Topbar } from "@/components/layout/topbar";
import { ScanRow } from "@/components/scan/scan-row";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { RowSkeleton } from "@/components/ui/skeleton";
import { listScans } from "@/lib/api/scans";
import { useAsync } from "@/lib/hooks/use-async";
import { SEVERITY_ORDER, SEVERITY_STYLES } from "@/lib/severity";
import { cn } from "@/lib/utils";

export default function ScansPage() {
  const [severity, setSeverity] = useState<string>("");
  const { data, loading, error, reload } = useAsync(
    () => listScans({ severity: severity || undefined }),
    [severity],
    "Couldn't load your scan history",
  );

  return (
    <>
      <Topbar
        title="Scan history"
        description={
          data ? `${data.count} ${data.count === 1 ? "scan" : "scans"}` : undefined
        }
      />

      <div className="p-5 lg:p-8">
        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-faint">
            <Filter className="h-3.5 w-3.5" />
            Severity
          </span>
          <button
            type="button"
            onClick={() => setSeverity("")}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              severity === ""
                ? "border-brand-400/30 bg-brand-softer text-accent-link"
                : "border-line-strong text-subtle hover:border-brand-400/40 hover:text-accent-link",
            )}
          >
            All
          </button>
          {SEVERITY_ORDER.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSeverity(severity === level ? "" : level)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                severity === level
                  ? SEVERITY_STYLES[level].chip
                  : "border-line-strong text-subtle hover:border-brand-400/40 hover:text-accent-link",
              )}
            >
              {SEVERITY_STYLES[level].label}
            </button>
          ))}
        </div>

        {loading ? (
          <RowSkeleton count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : data?.results.length ? (
          <div className="space-y-2">
            {data.results.map((scan) => (
              <ScanRow key={scan.id} scan={scan} />
            ))}
          </div>
        ) : (
          <Card>
            <CardBody>
              <EmptyState
                illustration={severity ? "no-data" : "scan-leaf"}
                title={severity ? "Nothing at that severity" : "No scans yet"}
                description={
                  severity
                    ? "Try a different severity, or clear the filter to see everything."
                    : "Photograph a leaf to get your first diagnosis."
                }
                action={
                  severity ? (
                    <button
                      type="button"
                      onClick={() => setSeverity("")}
                      className="rounded-xl border border-line-strong px-4 py-2 text-sm font-medium text-strong transition-colors hover:border-brand-400 hover:text-accent-link"
                    >
                      Clear filter
                    </button>
                  ) : (
                    <Link
                      href="/scan"
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-semibold text-[#03150D] transition-colors hover:bg-brand-400"
                    >
                      Scan a leaf
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )
                }
              />
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
}
