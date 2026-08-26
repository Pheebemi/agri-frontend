"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { FarmSummary } from "@/lib/api/types";
import { formatMoney } from "@/lib/utils";

export function ExpenseCategoryChart({ data }: { data: FarmSummary["by_category"] }) {
  const populated = data.filter((row) => row.total > 0);

  if (!populated.length) {
    return (
      <div className="grid h-[200px] place-items-center text-sm text-faint">
        No expenses yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={populated} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--text-faint)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--line)" }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--text-faint)" }}
          tickLine={false}
          axisLine={false}
          width={38}
        />
        <Tooltip
          cursor={{ fill: "var(--inset)" }}
          formatter={(value) => formatMoney(Number(value))}
          contentStyle={{
            background: "var(--surface-2)",
            border: "1px solid var(--line-strong)",
            borderRadius: 12,
            fontSize: 12,
            color: "var(--text-strong)",
          }}
          labelStyle={{ color: "var(--text-subtle)" }}
        />
        <Bar dataKey="total" name="Spent" fill="var(--color-brand-500)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
