"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ActivityPoint } from "@/lib/api/types";

/**
 * Colours are passed as `var(--token)` rather than resolved hex, so recharts
 * re-resolves them on a theme flip with no re-render on our side.
 */
export function ActivityChart({ data }: { data: ActivityPoint[] }) {
  const points = data.map((point) => ({
    ...point,
    label: new Date(point.date).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={points} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <defs>
          <linearGradient id="scanFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--text-faint)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--line)" }}
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--text-faint)" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={38}
        />
        <Tooltip
          cursor={{ stroke: "var(--line-strong)" }}
          contentStyle={{
            background: "var(--surface-2)",
            border: "1px solid var(--line-strong)",
            borderRadius: 12,
            fontSize: 12,
            color: "var(--text-strong)",
          }}
          labelStyle={{ color: "var(--text-subtle)" }}
        />
        <Area
          type="monotone"
          dataKey="count"
          name="Scans"
          stroke="var(--color-brand-500)"
          strokeWidth={2}
          fill="url(#scanFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
