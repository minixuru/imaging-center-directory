"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SelectOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (next: T) => void;
  /** Optional label rendered before the selected value (e.g. "Sort:"). */
  prefix?: string;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Min width of the trigger button. */
  className?: string;
  /** Where the dropdown anchors relative to the trigger. */
  align?: "left" | "right";
  ariaLabel?: string;
};

export function Select<T extends string>({
  value,
  options,
  onChange,
  prefix,
  icon,
  className,
  align = "left",
  ariaLabel,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const display = selected?.label ?? "";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-xs font-medium outline-none transition",
          open
            ? "border-indigo-500 ring-2 ring-indigo-100"
            : "border-slate-200 text-slate-700 hover:border-slate-300",
        )}
      >
        {icon && <span className="shrink-0 text-slate-500">{icon}</span>}
        <span className="min-w-0 flex-1 truncate text-left">
          {prefix && <span className="text-slate-400">{prefix} </span>}
          <span className="text-slate-900">{display}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-slate-400 transition",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute top-full z-30 mt-1.5 max-h-72 min-w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 whitespace-nowrap px-3 py-1.5 text-left text-xs",
                  active
                    ? "bg-indigo-50 font-medium text-indigo-700"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {opt.label}
                {active && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-indigo-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
