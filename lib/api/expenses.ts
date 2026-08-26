import { api } from "./client";
import type { Expense, ExpenseCategoryOption, ExpenseDetail, Paginated } from "./types";

export interface ExpenseFilters {
  farm?: number;
  category?: number;
  date__gte?: string;
  date__lte?: string;
}

function toQuery(filters: ExpenseFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.farm) params.set("farm", String(filters.farm));
  if (filters.category) params.set("category", String(filters.category));
  if (filters.date__gte) params.set("date__gte", filters.date__gte);
  if (filters.date__lte) params.set("date__lte", filters.date__lte);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function listExpenses(filters?: ExpenseFilters) {
  return api.get<Paginated<Expense>>(`/farms/expenses/${toQuery(filters)}`);
}

export interface ExpenseInput {
  farm: number;
  category: number;
  amount: string;
  date: string;
  note?: string;
}

export function createExpense(input: ExpenseInput) {
  return api.post<ExpenseDetail>("/farms/expenses/", input);
}

export function updateExpense(id: number, input: Partial<Omit<ExpenseInput, "farm">>) {
  return api.patch<ExpenseDetail>(`/farms/expenses/${id}/`, input);
}

export function deleteExpense(id: number) {
  return api.delete(`/farms/expenses/${id}/`);
}

/** Admin-managed — see ExpenseCategory in the backend. Active categories only. */
export function listExpenseCategories() {
  return api.get<ExpenseCategoryOption[]>("/farms/categories/");
}
