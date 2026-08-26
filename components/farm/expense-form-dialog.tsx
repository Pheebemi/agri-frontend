"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { errorMessage } from "@/lib/api/errors";
import { createExpense, listExpenseCategories, updateExpense } from "@/lib/api/expenses";
import type { Expense } from "@/lib/api/types";
import { useAsync } from "@/lib/hooks/use-async";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseFormDialog({
  open,
  onClose,
  farmId,
  expense,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  farmId: number;
  expense?: Expense | null;
  onSaved: () => void;
}) {
  const isEdit = Boolean(expense);
  const { data: categories, loading: categoriesLoading } = useAsync(
    () => listExpenseCategories(),
    [],
    "Couldn't load expense categories",
  );

  const [category, setCategory] = useState<string>(
    expense ? String(expense.category) : "",
  );
  const [amount, setAmount] = useState(expense?.amount ?? "");
  const [date, setDate] = useState(expense?.date ?? today());
  const [note, setNote] = useState(expense?.note ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!category) {
      toast.error("Pick a category first");
      return;
    }
    setSaving(true);
    try {
      if (isEdit && expense) {
        await updateExpense(expense.id, {
          category: Number(category),
          amount,
          date,
          note,
        });
        toast.success("Expense updated");
      } else {
        await createExpense({
          farm: farmId,
          category: Number(category),
          amount,
          date,
          note,
        });
        toast.success("Expense logged");
      }
      onSaved();
      onClose();
    } catch (caught) {
      toast.error(errorMessage(caught, "Couldn't save that expense"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? "Edit expense" : "Log an expense"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Category" htmlFor="expense-category">
          <Select
            id="expense-category"
            required
            disabled={categoriesLoading}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="" disabled>
              {categoriesLoading ? "Loading…" : "Select a category"}
            </option>
            {categories?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Amount (NGN)" htmlFor="expense-amount">
          <Input
            id="expense-amount"
            type="number"
            min="0.01"
            step="0.01"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </Field>
        <Field label="Date" htmlFor="expense-date">
          <Input
            id="expense-date"
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </Field>
        <Field label="Note" htmlFor="expense-note" hint="Optional — what was this for?">
          <Textarea
            id="expense-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </Field>
        <Button type="submit" block loading={saving}>
          {isEdit ? "Save changes" : "Log expense"}
        </Button>
      </form>
    </Dialog>
  );
}
