"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Images,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";

import { ActivityChart } from "@/components/charts/activity-chart";
import { SeverityChart } from "@/components/charts/severity-chart";
import { Topbar } from "@/components/layout/topbar";
import { ScanRow } from "@/components/scan/scan-row";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { CardSkeleton, RowSkeleton, Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { getAdminDashboard } from "@/lib/api/dashboard";
import { useAsync } from "@/lib/hooks/use-async";
import { SEVERITY_STYLES } from "@/lib/severity";

export default function AdminOverviewPage() {
  const { data, loading, error, reload } = useAsync(
    getAdminDashboard,
    [],
    "Couldn't load the admin overview",
  );

  return (
    <>
      <Topbar
        title="Platform overview"
        description="Everyone's scans, where outbreaks are clustering, and what needs review"
      />

      <div className="space-y-6 p-5 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            <CardSkeleton count={4} />
          ) : error ? null : (
            <>
              <StatCard
                label="Users"
                value={data?.totals.users ?? 0}
                icon={<Users className="h-4 w-4" />}
                hint={`${data?.totals.farmers ?? 0} farmers · ${data?.totals.agronomists ?? 0} agronomists`}
              />
              <StatCard
                label="Total scans"
                value={data?.totals.scans ?? 0}
                tone="brand"
                icon={<Images className="h-4 w-4" />}
                hint={`${data?.totals.scans_this_week ?? 0} in the last 7 days`}
              />
              <StatCard
                label="Awaiting review"
                value={data?.totals.pending_review ?? 0}
                tone={data?.totals.pending_review ? "warn" : "default"}
                icon={<ClipboardCheck className="h-4 w-4" />}
                hint="Low-confidence diagnoses"
              />
              <StatCard
                label="Knowledge base"
                value={data?.totals.diseases ?? 0}
                icon={<BookOpen className="h-4 w-4" />}
                hint={`across ${data?.totals.crops ?? 0} crops`}
              />
            </>
          )}
        </div>

        {error && <ErrorState message={error} onRetry={reload} />}

        {!error && (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div>
                    <CardTitle>Scan volume</CardTitle>
                    <p className="mt-1 text-sm text-body">Last 30 days, platform-wide</p>
                  </div>
                  <TrendingUp className="h-4 w-4 text-faint" />
                </CardHeader>
                <CardBody className="pt-4">
                  {loading ? (
                    <Skeleton className="h-[220px] w-full" />
                  ) : (
                    <ActivityChart data={data?.scan_activity ?? []} />
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Severity mix</CardTitle>
                </CardHeader>
                <CardBody className="pt-2">
                  {loading ? (
                    <Skeleton className="mx-auto h-[200px] w-[200px] rounded-full" />
                  ) : (
                    <>
                      <SeverityChart data={data?.severity_breakdown ?? []} />
                      <ul className="mt-4 space-y-1.5">
                        {(data?.severity_breakdown ?? [])
                          .filter((bucket) => bucket.count > 0)
                          .map((bucket) => (
                            <li
                              key={bucket.severity}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="flex items-center gap-2 text-body">
                                <span
                                  className={`h-2 w-2 rounded-full ${SEVERITY_STYLES[bucket.severity].bar}`}
                                />
                                {bucket.label}
                              </span>
                              <span className="font-mono text-xs text-subtle tabular-nums">
                                {bucket.count}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </>
                  )}
                </CardBody>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Outbreaks */}
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Outbreak watch</CardTitle>
                    <p className="mt-1 text-sm text-body">
                      Diseases confirmed at mild severity or worse
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="pt-4">
                  {loading ? (
                    <RowSkeleton count={4} />
                  ) : data?.outbreaks.length ? (
                    <ul className="space-y-3">
                      {data.outbreaks.map((outbreak) => (
                        <li
                          key={outbreak.slug}
                          className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">
                              {outbreak.disease}
                            </p>
                            <p className="text-xs text-subtle">
                              {outbreak.crop}
                              {outbreak.recent > 0 && (
                                <span className="ml-2 text-warn">
                                  +{outbreak.recent} this week
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="font-mono text-sm font-semibold text-ink tabular-nums">
                              {outbreak.count}
                            </p>
                            <p className="font-mono text-[10px] text-faint tabular-nums">
                              {outbreak.avg_confidence}% avg
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState
                      compact
                      illustration="eco-farming"
                      title="No outbreaks detected"
                      description="Nothing has been diagnosed above healthy yet."
                    />
                  )}
                </CardBody>
              </Card>

              {/* Regions */}
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>By region</CardTitle>
                    <p className="mt-1 text-sm text-body">
                      Where scans are coming from, and how many show disease
                    </p>
                  </div>
                  <MapPin className="h-4 w-4 text-faint" />
                </CardHeader>
                <CardBody className="pt-4">
                  {loading ? (
                    <RowSkeleton count={4} />
                  ) : data?.by_region.length ? (
                    <ul className="space-y-3">
                      {data.by_region.map((region) => {
                        const share = region.count
                          ? Math.round((region.unhealthy / region.count) * 100)
                          : 0;
                        return (
                          <li key={region.region}>
                            <div className="flex items-baseline justify-between text-sm">
                              <span className="font-medium text-ink">{region.region}</span>
                              <span className="font-mono text-xs text-subtle tabular-nums">
                                {region.unhealthy}/{region.count} affected
                              </span>
                            </div>
                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-inset">
                              <div
                                className="h-full rounded-full bg-sev-severe transition-[width] duration-700"
                                style={{ width: `${Math.max(2, share)}%` }}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <EmptyState
                      compact
                      illustration="no-data"
                      title="No regional data yet"
                      description="Region comes from each farmer's profile."
                    />
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Review queue */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Review queue</CardTitle>
                  <p className="mt-1 text-sm text-body">
                    Scans the model wasn&apos;t confident enough to stand behind
                  </p>
                </div>
                <Link
                  href="/admin/review"
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent-link hover:underline"
                >
                  Open queue
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardHeader>
              <CardBody className="pt-4">
                {loading ? (
                  <RowSkeleton count={3} />
                ) : data?.review_queue.length ? (
                  <div className="space-y-2">
                    {data.review_queue.map((scan) => (
                      <ScanRow key={scan.id} scan={scan} showOwner />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    compact
                    illustration="diagnosis"
                    title="Queue is clear"
                    description="Every diagnosis is either confident or already reviewed."
                  />
                )}
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
