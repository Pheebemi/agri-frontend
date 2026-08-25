import type { SeverityLevel } from "@/lib/api/types";

/**
 * Severity is the app's core visual signal, so its class strings live in one
 * place rather than being retyped per component. Tailwind can only see complete
 * class names, which is why these are written out in full instead of built with
 * template strings.
 */
export const SEVERITY_STYLES: Record<
  SeverityLevel,
  { chip: string; text: string; bar: string; ring: string; label: string }
> = {
  HEALTHY: {
    chip: "bg-sev-healthy-soft text-sev-healthy border-sev-healthy/25",
    text: "text-sev-healthy",
    bar: "bg-sev-healthy",
    ring: "ring-sev-healthy/30",
    label: "Healthy",
  },
  MILD: {
    chip: "bg-sev-mild-soft text-sev-mild border-sev-mild/25",
    text: "text-sev-mild",
    bar: "bg-sev-mild",
    ring: "ring-sev-mild/30",
    label: "Mild",
  },
  MODERATE: {
    chip: "bg-sev-moderate-soft text-sev-moderate border-sev-moderate/25",
    text: "text-sev-moderate",
    bar: "bg-sev-moderate",
    ring: "ring-sev-moderate/30",
    label: "Moderate",
  },
  SEVERE: {
    chip: "bg-sev-severe-soft text-sev-severe border-sev-severe/25",
    text: "text-sev-severe",
    bar: "bg-sev-severe",
    ring: "ring-sev-severe/30",
    label: "Severe",
  },
  CRITICAL: {
    chip: "bg-sev-critical-soft text-sev-critical border-sev-critical/25",
    text: "text-sev-critical",
    bar: "bg-sev-critical",
    ring: "ring-sev-critical/30",
    label: "Critical",
  },
};

export const SEVERITY_ORDER: SeverityLevel[] = [
  "HEALTHY",
  "MILD",
  "MODERATE",
  "SEVERE",
  "CRITICAL",
];

/** Chart colours read from CSS vars so they follow the theme with no re-render. */
export const SEVERITY_CHART_COLOR: Record<SeverityLevel, string> = {
  HEALTHY: "var(--sev-healthy)",
  MILD: "var(--sev-mild)",
  MODERATE: "var(--sev-moderate)",
  SEVERE: "var(--sev-severe)",
  CRITICAL: "var(--sev-critical)",
};

export function severityStyle(severity: SeverityLevel | "" | null | undefined) {
  return SEVERITY_STYLES[(severity || "MODERATE") as SeverityLevel];
}
