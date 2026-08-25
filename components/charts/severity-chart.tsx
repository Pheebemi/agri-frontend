"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { SeverityBucket } from "@/lib/api/types";
import { SEVERITY_CHART_COLOR } from "@/lib/severity";

export function SeverityChart({ data }: { data: SeverityBucket[] }) {
  const populated = data.filter((bucket) => bucket.count > 0);

  if (!populated.length) {
    return (
      <div className="grid h-[200px] place-items-center text-sm text-faint">
        No diagnoses yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={populated}
          dataKey="count"
          nameKey="label"
          innerRadius={52}
          outerRadius={78}
          paddingAngle={3}
          stroke="var(--surface)"
          strokeWidth={2}
        >
          {populated.map((bucket) => (
            <Cell key={bucket.severity} fill={SEVERITY_CHART_COLOR[bucket.severity]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "var(--surface-2)",
            border: "1px solid var(--line-strong)",
            borderRadius: 12,
            fontSize: 12,
            color: "var(--text-strong)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
