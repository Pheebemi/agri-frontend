"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  HeartPulse,
  Images,
} from "lucide-react";

import { ActivityChart } from "@/components/charts/activity-chart";
import { SeverityChart } from "@/components/charts/severity-chart";
import { Topbar } from "@/components/layout/topbar";
import { ScanRow } from "@/components/scan/scan-row";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherCard } from "@/components/weather/weather-card";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { CardSkeleton, RowSkeleton, Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { getFarmerDashboard } from "@/lib/api/dashboard";
import { useAuth } from "@/lib/auth-context";
import { useAsync } from "@/lib/hooks/use-async";
import { SEVERITY_STYLES } from "@/lib/severity";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(
    getFarmerDashboard,
    [],
    "Couldn't load your dashboard",
  );

  const firstName = (user?.full_name || "").split(" ")[0];

  return (
    <>
      <Topbar
        title={firstName ? `Good to see you, ${firstName}` : "Dashboard"}
        description={
          user?.farm_name ? `${user.farm_name}${user.region ? ` · ${user.region}` : ""}` : undefined
        }
      />

      <div className="space-y-6 p-5 lg:p-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            <CardSkeleton count={4} />
          ) : error ? null : (
            <>
              <StatCard
                label="Total scans"
                value={data?.totals.scans ?? 0}
                icon={<Images className="h-4 w-4" />}
                hint="Across all your crops"
              />
              <StatCard
                label="Healthy"
                value={data?.totals.healthy ?? 0}
                tone="brand"
                icon={<HeartPulse className="h-4 w-4" />}
                hint={`${data?.totals.health_rate ?? 0}% of diagnosed scans`}
              />
              <StatCard
                label="Needs attention"
                value={data?.totals.needs_attention ?? 0}
                tone={data?.totals.needs_attention ? "err" : "default"}
                icon={<AlertTriangle className="h-4 w-4" />}
                hint="Severe or critical"
              />
              <StatCard
                label="Awaiting review"
                value={data?.totals.pending_review ?? 0}
                tone={data?.totals.pending_review ? "warn" : "default"}
                icon={<ClipboardCheck className="h-4 w-4" />}
                hint="An agronomist will confirm"
              />
            </>
          )}
        </div>

        {error && <ErrorState message={error} onRetry={reload} />}

        {!error && (
          <>
            {/* Weather */}
            <WeatherCard />

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div>
                    <CardTitle>Scan activity</CardTitle>
                    <p className="mt-1 text-sm text-body">Last 14 days</p>
                  </div>
                  <Activity className="h-4 w-4 text-faint" />
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

            {/* Recent + top issues */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent scans</CardTitle>
                  <Link
                    href="/scans"
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent-link hover:underline"
                  >
                    View all
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardHeader>
                <CardBody className="pt-4">
                  {loading ? (
                    <RowSkeleton count={3} />
                  ) : data?.recent_scans.length ? (
                    <div className="space-y-2">
                      {data.recent_scans.map((scan) => (
                        <ScanRow key={scan.id} scan={scan} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      compact
                      illustration="scan-leaf"
                      title="No scans yet"
                      description="Photograph a leaf to get your first diagnosis."
                      action={
                        <Link
                          href="/scan"
                          className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-semibold text-[#03150D] transition-colors hover:bg-brand-400"
                        >
                          Scan a leaf
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      }
                    />
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most common issues</CardTitle>
                </CardHeader>
                <CardBody className="pt-4">
                  {loading ? (
                    <RowSkeleton count={3} />
                  ) : data?.top_issues.length ? (
                    <ul className="space-y-3">
                      {data.top_issues.map((issue) => (
                        <li key={issue.slug} className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">
                              {issue.disease}
                            </p>
                            <p className="text-xs text-subtle">{issue.crop}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-inset px-2.5 py-1 font-mono text-xs text-subtle tabular-nums">
                            {issue.count}×
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-8 text-center text-sm text-faint">
                      Nothing diagnosed yet
                    </p>
                  )}
                </CardBody>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
