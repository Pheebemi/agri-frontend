"use client";

import { useState } from "react";
import { Beaker, CalendarClock, Leaf, ShieldCheck, Zap } from "lucide-react";

import type { Treatment } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const APPROACH_META = {
  IMMEDIATE: {
    label: "Do now",
    icon: Zap,
    chip: "bg-err-soft text-err border-err/25",
    blurb: "Act on these within a day or two — they slow the spread fastest.",
  },
  ORGANIC: {
    label: "Organic",
    icon: Leaf,
    chip: "bg-ok-soft text-ok border-ok/25",
    blurb: "Cultural and biological controls. Slower, but no residue and no resistance.",
  },
  CHEMICAL: {
    label: "Chemical",
    icon: Beaker,
    chip: "bg-warn-soft text-warn border-warn/25",
    blurb: "Read the label, wear protection, and observe the pre-harvest interval.",
  },
  PREVENTIVE: {
    label: "Prevent",
    icon: ShieldCheck,
    chip: "bg-brand-softer text-accent-link border-brand-400/25",
    blurb: "For next season — this is how you stop it coming back.",
  },
} as const;

type Approach = keyof typeof APPROACH_META;

const ORDER: Approach[] = ["IMMEDIATE", "ORGANIC", "CHEMICAL", "PREVENTIVE"];

export function TreatmentPlan({ treatments }: { treatments: Treatment[] }) {
  const grouped = ORDER.map((approach) => ({
    approach,
    items: treatments.filter((treatment) => treatment.approach === approach),
  })).filter((group) => group.items.length > 0);

  const [active, setActive] = useState<Approach>(grouped[0]?.approach ?? "ORGANIC");

  if (!grouped.length) {
    return (
      <p className="py-8 text-center text-sm text-faint">
        No treatment protocol recorded for this diagnosis yet.
      </p>
    );
  }

  const current = grouped.find((group) => group.approach === active) ?? grouped[0];
  const meta = APPROACH_META[current.approach];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {grouped.map((group) => {
          const groupMeta = APPROACH_META[group.approach];
          const selected = group.approach === current.approach;
          return (
            <button
              key={group.approach}
              type="button"
              onClick={() => setActive(group.approach)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all",
                selected
                  ? groupMeta.chip
                  : "border-line-strong text-subtle hover:border-brand-400/40 hover:text-accent-link",
              )}
            >
              <groupMeta.icon className="h-3.5 w-3.5" />
              {groupMeta.label}
              <span className="font-mono opacity-60">{group.items.length}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-sm text-body">{meta.blurb}</p>

      <ol className="mt-5 space-y-3">
        {current.items.map((treatment, index) => (
          <li
            key={treatment.id}
            className="rounded-xl border border-line bg-surface-2 p-4"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-inset font-mono text-xs font-bold text-subtle">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{treatment.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-body">
                  {treatment.instructions}
                </p>

                {(treatment.timeframe || treatment.materials_list.length > 0) && (
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {treatment.timeframe && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-link">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {treatment.timeframe}
                      </span>
                    )}
                    {treatment.materials_list.map((material) => (
                      <span
                        key={material}
                        className="rounded-md bg-inset px-2 py-1 text-[11px] text-subtle"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
