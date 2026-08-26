"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Wallet } from "lucide-react";

import { FarmFormDialog } from "@/components/farm/farm-form-dialog";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { getFarmSummary, listFarms } from "@/lib/api/farms";
import { useAsync } from "@/lib/hooks/use-async";
import { formatMoney } from "@/lib/utils";

export default function FarmsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data: farms,
    loading,
    error,
    reload,
  } = useAsync(() => listFarms(), [], "Couldn't load your farms");
  const { data: summary, reload: reloadSummary } = useAsync(
    () => getFarmSummary(),
    [],
    "Couldn't load totals",
  );

  function handleSaved() {
    reload();
    reloadSummary();
  }

  return (
    <>
      <Topbar
        title="Farms"
        description={
          farms ? `${farms.count} ${farms.count === 1 ? "farm" : "farms"}` : undefined
        }
        action={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add farm
          </Button>
        }
      />

      <div className="p-5 lg:p-8">
        {summary && summary.expense_count > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Total spent"
              value={formatMoney(summary.grand_total)}
              tone="brand"
              icon={<Wallet className="h-4 w-4" />}
            />
            {summary.by_category
              .filter((row) => row.total > 0)
              .map((row) => (
                <StatCard key={row.category} label={row.label} value={formatMoney(row.total)} />
              ))}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton count={3} />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : farms?.results.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {farms.results.map((farm) => (
              <Link
                key={farm.id}
                href={`/farms/${farm.id}`}
                className="rounded-xl border border-line bg-surface p-5 shadow-sm transition-colors hover:border-brand-400/40 hover:bg-surface-2"
              >
                <p className="font-semibold text-ink">{farm.name}</p>
                {farm.crop_list.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {farm.crop_list.map((crop) => (
                      <span
                        key={crop}
                        className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-accent-link"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-4 font-mono text-2xl font-bold tabular-nums text-ink">
                  {formatMoney(farm.total_spent)}
                </p>
                <p className="mt-0.5 text-xs text-subtle">
                  {farm.expense_count} {farm.expense_count === 1 ? "expense" : "expenses"} logged
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody>
              <EmptyState
                illustration="empty-state"
                title="No farms yet"
                description="Add your first farm to start tracking costs."
                action={
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add a farm
                  </Button>
                }
              />
            </CardBody>
          </Card>
        )}
      </div>

      <FarmFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSaved={handleSaved}
      />
    </>
  );
}
