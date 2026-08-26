"use client";

import { use, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Receipt, Trash2, Wallet } from "lucide-react";

import { ExpenseFormDialog } from "@/components/farm/expense-form-dialog";
import { FarmFormDialog } from "@/components/farm/farm-form-dialog";
import { Topbar } from "@/components/layout/topbar";
import { ExpenseCategoryChart } from "@/components/charts/expense-category-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Field, Input } from "@/components/ui/input";
import { RowSkeleton, Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { errorMessage } from "@/lib/api/errors";
import { deleteExpense, listExpenses } from "@/lib/api/expenses";
import { getFarm, getFarmSummary } from "@/lib/api/farms";
import type { ChipTone, Expense } from "@/lib/api/types";
import { useAsync } from "@/lib/hooks/use-async";
import { formatDate, formatMoney } from "@/lib/utils";

// A category's `color` comes from the admin-managed ExpenseCategory row, not
// a fixed list here — this just maps that shared tone vocabulary to classes.
const TONE_CLASS: Record<ChipTone, string> = {
  info: "bg-brand-softer text-accent-link border-brand-400/25",
  ok: "bg-ok-soft text-ok border-ok/25",
  warn: "bg-warn-soft text-warn border-warn/25",
  err: "bg-err-soft text-err border-err/25",
};

export default function FarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const farmId = Number(id);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [farmDialogOpen, setFarmDialogOpen] = useState(false);
  const [expenseDialog, setExpenseDialog] = useState<{ open: boolean; expense: Expense | null }>(
    { open: false, expense: null },
  );

  const {
    data: farm,
    loading,
    error,
    reload,
  } = useAsync(() => getFarm(id), [id], "Couldn't load that farm");

  const {
    data: expenses,
    loading: expensesLoading,
    error: expensesError,
    reload: reloadExpenses,
  } = useAsync(
    () =>
      listExpenses({
        farm: farmId,
        date__gte: dateFrom || undefined,
        date__lte: dateTo || undefined,
      }),
    [farmId, dateFrom, dateTo],
    "Couldn't load expenses",
  );

  const {
    data: summary,
    reload: reloadSummary,
  } = useAsync(
    () =>
      getFarmSummary({
        farm: farmId,
        date__gte: dateFrom || undefined,
        date__lte: dateTo || undefined,
      }),
    [farmId, dateFrom, dateTo],
    "Couldn't load totals",
  );

  function refreshAll() {
    reload();
    reloadExpenses();
    reloadSummary();
  }

  async function handleDelete(expense: Expense) {
    if (!confirm(`Delete this ${expense.category_name.toLowerCase()} expense?`)) return;
    try {
      await deleteExpense(expense.id);
      toast.success("Expense deleted");
      reloadExpenses();
      reloadSummary();
      reload();
    } catch (caught) {
      toast.error(errorMessage(caught, "Couldn't delete that expense"));
    }
  }

  if (loading) {
    return (
      <>
        <Topbar title="Farm" />
        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1.4fr] lg:p-8">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </>
    );
  }

  if (error || !farm) {
    return (
      <>
        <Topbar title="Farm" />
        <div className="p-5 lg:p-8">
          <ErrorState message={error ?? "Farm not found"} onRetry={reload} />
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar
        title={farm.name}
        description={`${farm.expense_count} ${farm.expense_count === 1 ? "expense" : "expenses"} logged`}
        action={
          <Button variant="secondary" size="sm" onClick={() => setFarmDialogOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        }
      />

      <div className="space-y-6 p-5 lg:p-8">
        {farm.crop_list.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
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

        {/* Date-range filter */}
        <div className="flex flex-wrap items-end gap-3">
          <Field label="From" htmlFor="date-from">
            <Input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </Field>
          <Field label="To" htmlFor="date-to">
            <Input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </Field>
          {(dateFrom || dateTo) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Totals */}
        {summary && (
          <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Total spent"
                value={formatMoney(summary.grand_total)}
                tone="brand"
                icon={<Wallet className="h-4 w-4" />}
                className="col-span-2"
              />
              {summary.by_category
                .filter((row) => row.total > 0)
                .map((row) => (
                  <StatCard key={row.category} label={row.label} value={formatMoney(row.total)} />
                ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Spend by category</CardTitle>
              </CardHeader>
              <CardBody className="pt-4">
                <ExpenseCategoryChart data={summary.by_category} />
              </CardBody>
            </Card>
          </div>
        )}

        {/* Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <Button size="sm" onClick={() => setExpenseDialog({ open: true, expense: null })}>
              <Plus className="h-3.5 w-3.5" />
              Log expense
            </Button>
          </CardHeader>
          <CardBody className="pt-4">
            {expensesLoading ? (
              <RowSkeleton count={4} />
            ) : expensesError ? (
              <ErrorState message={expensesError} onRetry={reloadExpenses} />
            ) : expenses?.results.length ? (
              <div className="space-y-2">
                {expenses.results.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center gap-4 rounded-xl border border-line bg-surface-2 p-4"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-inset text-subtle">
                      <Receipt className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={TONE_CLASS[expense.category_color]}>
                          {expense.category_name}
                        </Badge>
                        <span className="text-xs text-faint">{formatDate(expense.date)}</span>
                      </div>
                      {expense.note && (
                        <p className="mt-1 truncate text-sm text-body">{expense.note}</p>
                      )}
                    </div>
                    <p className="shrink-0 font-mono text-sm font-semibold tabular-nums text-ink">
                      {formatMoney(expense.amount)}
                    </p>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setExpenseDialog({ open: true, expense })}
                        className="rounded-lg p-2 text-faint transition-colors hover:bg-inset hover:text-strong"
                        aria-label="Edit expense"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(expense)}
                        className="rounded-lg p-2 text-faint transition-colors hover:bg-err-soft hover:text-err"
                        aria-label="Delete expense"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                illustration="no-data"
                title="No expenses logged yet"
                description="Log labor, fertilizer, transportation, or other costs against this farm."
                compact
                action={
                  <Button onClick={() => setExpenseDialog({ open: true, expense: null })}>
                    <Plus className="h-4 w-4" />
                    Log an expense
                  </Button>
                }
              />
            )}
          </CardBody>
        </Card>
      </div>

      <FarmFormDialog
        open={farmDialogOpen}
        onClose={() => setFarmDialogOpen(false)}
        farm={farm}
        onSaved={refreshAll}
      />
      <ExpenseFormDialog
        open={expenseDialog.open}
        onClose={() => setExpenseDialog({ open: false, expense: null })}
        farmId={farmId}
        expense={expenseDialog.expense}
        onSaved={refreshAll}
      />
    </>
  );
}
