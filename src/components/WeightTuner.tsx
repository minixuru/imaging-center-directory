"use client";

import { ChevronDown, ChevronUp, RotateCcw, Sliders } from "lucide-react";
import { useState } from "react";
import { DEFAULT_WEIGHTS, FACTOR_LABELS } from "@/lib/ranking";
import type { RankingWeights } from "@/lib/types";
import { cn } from "@/lib/cn";

type Props = {
  weights: RankingWeights;
  onChange: (next: RankingWeights) => void;
};

const FACTOR_HINTS: Record<keyof RankingWeights, string> = {
  distance: "How close to the patient",
  quality: "Patient rating × review volume",
  turnaround: "Hours from scan to final report",
  cost: "Estimated patient out-of-pocket",
  availability: "How soon the next appointment is",
  partner: "Expert Radiology partner uplift",
};

export function WeightTuner({ weights, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const isCustom = (Object.keys(weights) as Array<keyof RankingWeights>).some(
    (k) => weights[k] !== DEFAULT_WEIGHTS[k],
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
          <Sliders className="h-4 w-4 text-slate-500" />
          Ranking weights
          {isCustom && (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-200">
              Custom
            </span>
          )}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="space-y-3 border-t border-slate-200 px-4 py-4">
          <p className="text-xs text-slate-500">
            Tune how each factor weighs into the composite score. Sum is
            normalized — relative values are what matter.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(weights) as Array<keyof RankingWeights>).map((k) => (
              <label key={k} className="block">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-xs font-medium text-slate-700">
                    {FACTOR_LABELS[k]}
                  </span>
                  <span className="text-xs tabular-nums text-slate-500">
                    {Math.round(weights[k] * 100)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={weights[k]}
                  onChange={(e) =>
                    onChange({ ...weights, [k]: Number(e.target.value) })
                  }
                  className={cn(
                    "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200",
                    "accent-slate-900",
                  )}
                />
                <div className="mt-1 text-[11px] leading-tight text-slate-400">
                  {FACTOR_HINTS[k]}
                </div>
              </label>
            ))}
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => onChange(DEFAULT_WEIGHTS)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset to defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
