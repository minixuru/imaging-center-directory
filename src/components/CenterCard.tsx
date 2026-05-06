"use client";

import {
  Award,
  Clock,
  DollarSign,
  MapPin,
  Star,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import type { ScoredCenter } from "@/lib/types";
import { cn } from "@/lib/cn";

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

function fmtAvail(hours: number) {
  if (hours <= 4) return "Today";
  if (hours <= 24) return "Tomorrow";
  const days = Math.round(hours / 24);
  return `${days}d`;
}

export function CenterCard({ scored, rank, selected, onSelect }: Props) {
  const { center, distanceMiles, score, inNetwork, modalityMatch } = scored;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border bg-white p-4 text-left transition shadow-sm",
        "hover:border-slate-300 hover:shadow-md",
        selected ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tabular-nums text-slate-400">
              #{rank}
            </span>
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {center.name}
            </h3>
            {center.isExpertRadiologyPartner && (
              <span
                title="Expert Radiology partner — uses PrecisionPlus reporting"
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-200"
              >
                <Award className="h-3 w-3" /> Partner
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-slate-500">
            {center.address.line1} · {center.address.city}, {center.address.state}
          </p>
        </div>
        <div
          className={cn(
            "shrink-0 rounded-lg px-2.5 py-1.5 text-center ring-1 ring-inset",
            scoreColor(score),
          )}
        >
          <div className="text-lg font-semibold leading-none tabular-nums">
            {score}
          </div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide opacity-70">
            score
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          {distanceMiles.toFixed(1)} mi
        </span>
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-amber-500" />
          {center.patientRating.toFixed(1)}{" "}
          <span className="text-slate-400">({center.reviewCount})</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          {center.avgTurnaroundHours}h report
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarCheck className="h-3.5 w-3.5 text-slate-400" />
          {fmtAvail(center.nextAvailableHours)}
        </span>
        <span className="inline-flex items-center gap-1">
          <DollarSign className="h-3.5 w-3.5 text-slate-400" />${" "}
          {center.estimatedMriCostUSD.toLocaleString()}
        </span>
      </div>

      {(!inNetwork || !modalityMatch) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {!modalityMatch && (
            <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 ring-1 ring-rose-200">
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
    </button>
  );
}
