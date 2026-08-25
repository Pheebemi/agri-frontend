"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STAGES = [
  "Reading the image…",
  "Separating leaf from background…",
  "Measuring affected tissue…",
  "Matching against the disease library…",
  "Building your treatment plan…",
];

/**
 * The diagnosis call is a single synchronous request, so there is no real
 * progress to report. These stages describe what the pipeline genuinely does,
 * in order, rather than animating a fake percentage.
 */
export function AnalyzingOverlay() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((current) => Math.min(current + 1, STAGES.length - 1));
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-page/92 backdrop-blur-md">
      <div className="flex w-full max-w-xs flex-col items-center px-6 text-center">
        <div className="relative grid h-24 w-24 place-items-center">
          <span className="absolute inset-0 rounded-full bg-brand-500/20 animate-pulse-ring" />
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-500 text-[#03150D]">
            <Loader2 className="h-7 w-7 animate-spin" />
          </span>
        </div>

        <p className="mt-6 font-semibold text-ink">Analysing your leaf</p>
        <p className="mt-1.5 min-h-10 text-sm text-body">{STAGES[stage]}</p>

        <div className="mt-5 flex gap-1.5">
          {STAGES.map((label, index) => (
            <span
              key={label}
              className={`h-1 w-6 rounded-full transition-colors duration-500 ${
                index <= stage ? "bg-brand-500" : "bg-inset"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
