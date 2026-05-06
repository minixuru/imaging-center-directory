"use client";

import {
  Award,
  CalendarCheck,
  Clock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import type { ScoredCenter } from "@/lib/types";
import { cn } from "@/lib/cn";
import {
  MODALITY_STYLE,
  formatHour,
  formatNextAvailable,
  gradientFor,
  initialsFor,
  isOpenNow,
} from "@/lib/visuals";
import { Stars } from "./Stars";

type Props = {
  scored: ScoredCenter;
  rank: number;
  selected: boolean;
  onSelect: () => void;
};

function scoreColor(score: number) {
  if (score >= 80) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (score >= 65) return "bg-sky-50 text-sky-700 ring-sky-200";
  if (score >= 50) return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-slate-50 text-slate-700 ring-slate-200";
}

export function CenterCard({ scored, rank, selected, onSelect }: Props) {
  const { center, distanceMiles, score, inNetwork, modalityMatch } = scored;
  const grad = gradientFor(center.id);
  const initials = initialsFor(center.name);
  const open = isOpenNow(center);
  const visibleMods = center.modalities.slice(0, 4);
  const hiddenMods = center.modalities.length - visibleMods.length;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex w-full overflow-hidden rounded-xl bg-white text-left ring-1 transition",
        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500",
        selected
          ? "shadow-md ring-2 ring-indigo-500"
          : "ring-slate-200 hover:ring-slate-300",
      )}
    >
      <div
        className="relative flex w-20 shrink-0 items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
        }}
      >
        <span className="text-xl font-semibold tracking-tight">{initials}</span>
        <span className="absolute left-1.5 top-1.5 rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
          #{rank}
        </span>
      </div>

      <div className="min-w-0 flex-1 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {center.name}
            </h3>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {center.address.city}, {center.address.state} ·{" "}
              {distanceMiles.toFixed(1)} mi
            </p>
          </div>
          <div
            className={cn(
              "shrink-0 rounded-lg px-2 py-1 text-center ring-1 ring-inset",
              scoreColor(score),
            )}
          >
            <div className="text-base font-semibold leading-none tabular-nums">
              {score}
            </div>
            <div className="mt-0.5 text-[9px] uppercase tracking-wide opacity-70">
              score
            </div>
          </div>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="inline-flex items-center gap-1">
            <Stars value={center.patientRating} size={13} />
            <span className="font-medium text-slate-900">
              {center.patientRating.toFixed(1)}
            </span>
            <span className="text-slate-400">({center.reviewCount})</span>
          </span>
          {open.open ? (
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Open until {formatHour(open.closesAt!)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              Closed
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <CalendarCheck className="h-3.5 w-3.5 text-slate-400" />
            {formatNextAvailable(center.nextAvailableHours)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {center.avgTurnaroundHours}h report
          </span>
          {center.isExpertRadiologyPartner && (
            <span className="inline-flex items-center gap-1 text-indigo-700">
              <Award className="h-3.5 w-3.5" />
              Partner
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {visibleMods.map((m) => (
            <span
              key={m}
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                MODALITY_STYLE[m],
              )}
            >
              {m}
            </span>
          ))}
          {hiddenMods > 0 && (
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
              +{hiddenMods}
            </span>
          )}
        </div>

        {(!inNetwork || !modalityMatch) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {!modalityMatch && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 ring-1 ring-rose-200">
                <ShieldAlert className="h-3 w-3" />
                Modality not offered
              </span>
            )}
            {!inNetwork && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200">
                <ShieldCheck className="h-3 w-3" />
                Out of network
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
