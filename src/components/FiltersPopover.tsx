"use client";

import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  EMPTY_FILTERS,
  activeFilterCount,
  isAnyFilterActive,
} from "@/lib/filters";
import type { Accreditation, FilterState, Subspecialty } from "@/lib/types";
import { accreditationLabel } from "@/lib/visuals";

const DISTANCE_OPTIONS: Array<[number | null, string]> = [
  [1, "1 mi"],
  [5, "5 mi"],
  [10, "10 mi"],
  [25, "25 mi"],
  [50, "50 mi"],
  [null, "Any"],
];

const ALL_ACCREDITATIONS: Accreditation[] = [
  "ACR-MRI",
  "ACR-CT",
  "ACR-Mammography",
  "ACR-Breast-MRI",
  "ACR-Ultrasound",
  "ACR-Nuclear",
  "ACR-Stereotactic-Breast",
];

const ALL_SUBSPECIALTIES: Subspecialty[] = [
  "Neuro",
  "MSK",
  "Body",
  "Breast",
  "Cardiac",
  "Pediatric",
];

type Props = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  availableStates: string[];
};

function toggleArray<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

export function FiltersPopover({ filters, onChange, availableStates }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = activeFilterCount(filters);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          count > 0
            ? "inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100"
            : "inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300"
        }
      >
        <Filter className="h-3.5 w-3.5" />
        Filters
        {count > 0 && (
          <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white">
            {count}
          </span>
        )}
        <ChevronDown
          className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
            <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
            <button
              type="button"
              onClick={() => onChange(EMPTY_FILTERS)}
              disabled={!isAnyFilterActive(filters)}
              className="text-xs text-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset
            </button>
          </div>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto p-3">
            <Section title="Distance">
              <div className="flex flex-wrap gap-1.5">
                {DISTANCE_OPTIONS.map(([d, l]) => (
                  <ChipBtn
                    key={l}
                    active={filters.maxDistanceMiles === d}
                    onClick={() =>
                      onChange({ ...filters, maxDistanceMiles: d })
                    }
                  >
                    {l}
                  </ChipBtn>
                ))}
              </div>
            </Section>

            {availableStates.length > 1 && (
              <Section title="State">
                <div className="flex flex-wrap gap-1.5">
                  {availableStates.map((s) => (
                    <ChipBtn
                      key={s}
                      active={filters.states.includes(s)}
                      onClick={() =>
                        onChange({
                          ...filters,
                          states: toggleArray(filters.states, s),
                        })
                      }
                    >
                      {s}
                    </ChipBtn>
                  ))}
                </div>
              </Section>
            )}

            <Section title="ACR accreditation">
              <div className="flex flex-wrap gap-1.5">
                {ALL_ACCREDITATIONS.map((a) => (
                  <ChipBtn
                    key={a}
                    active={filters.accreditations.includes(a)}
                    onClick={() =>
                      onChange({
                        ...filters,
                        accreditations: toggleArray(filters.accreditations, a),
                      })
                    }
                  >
                    {accreditationLabel(a).replace("ACR · ", "")}
                  </ChipBtn>
                ))}
              </div>
            </Section>

            <Section title="Subspecialty">
              <div className="flex flex-wrap gap-1.5">
                {ALL_SUBSPECIALTIES.map((s) => (
                  <ChipBtn
                    key={s}
                    active={filters.subspecialties.includes(s)}
                    onClick={() =>
                      onChange({
                        ...filters,
                        subspecialties: toggleArray(filters.subspecialties, s),
                      })
                    }
                  >
                    {s}
                  </ChipBtn>
                ))}
              </div>
            </Section>

            <Section title="Other">
              <div className="space-y-0.5">
                <Toggle
                  active={filters.walkInsOnly}
                  onClick={() =>
                    onChange({ ...filters, walkInsOnly: !filters.walkInsOnly })
                  }
                  label="Walk-ins accepted"
                />
                <Toggle
                  active={filters.onsiteRadiologistOnly}
                  onClick={() =>
                    onChange({
                      ...filters,
                      onsiteRadiologistOnly: !filters.onsiteRadiologistOnly,
                    })
                  }
                  label="On-site radiologist"
                />
              </div>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h4>
      {children}
    </div>
  );
}

function ChipBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm"
          : "rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
      }
    >
      {children}
    </button>
  );
}

function Toggle({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-md px-1 py-1.5 text-xs hover:bg-slate-50"
    >
      <span className="text-slate-700">{label}</span>
      <span
        className={
          active
            ? "relative h-4 w-7 rounded-full bg-indigo-600 transition"
            : "relative h-4 w-7 rounded-full bg-slate-300 transition"
        }
      >
        <span
          className={
            active
              ? "absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-white shadow transition"
              : "absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white shadow transition"
          }
        />
      </span>
    </button>
  );
}
