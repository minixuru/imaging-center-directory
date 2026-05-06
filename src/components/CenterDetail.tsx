"use client";

import {
  Award,
  Building2,
  CalendarCheck,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  X,
} from "lucide-react";
import { FACTOR_LABELS } from "@/lib/ranking";
import type { ScoredCenter } from "@/lib/types";
import { cn } from "@/lib/cn";

type Props = {
  scored: ScoredCenter;
  onClose: () => void;
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium tabular-nums text-slate-900">
          {Math.round(value)}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            "h-full rounded-full",
            value >= 80
              ? "bg-emerald-500"
              : value >= 60
                ? "bg-sky-500"
                : value >= 40
                  ? "bg-amber-500"
                  : "bg-rose-500",
          )}
          style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

export function CenterDetail({ scored, onClose }: Props) {
  const { center, distanceMiles, score, breakdown, inNetwork, modalityMatch } =
    scored;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-white p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-semibold text-slate-900">
              {center.name}
            </h2>
            {center.isExpertRadiologyPartner && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-200">
                <Award className="h-3 w-3" /> Partner
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {center.address.line1} · {center.address.city},{" "}
            {center.address.state} {center.address.zip}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail"
          className="-m-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="text-center">
            <div className="text-2xl font-semibold tabular-nums text-slate-900">
              {score}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-slate-500">
              composite
            </div>
          </div>
          <div className="flex flex-col gap-0.5 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {distanceMiles.toFixed(1)} miles from patient
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-500" />
              {center.patientRating.toFixed(1)} ({center.reviewCount} reviews)
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              ~{center.avgTurnaroundHours}h to final report
            </span>
          </div>
        </div>

        {(!modalityMatch || !inNetwork) && (
          <div className="space-y-2">
            {!modalityMatch && (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                This center does not currently offer the requested modality.
              </div>
            )}
            {!inNetwork && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Out-of-network for the patient&apos;s insurance plan. Patient
                may face higher out-of-pocket cost.
              </div>
            )}
          </div>
        )}

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Score breakdown
          </h3>
          <div className="space-y-2.5">
            {(Object.keys(breakdown) as Array<keyof typeof breakdown>).map(
              (k) => (
                <ScoreBar key={k} label={FACTOR_LABELS[k]} value={breakdown[k]} />
              ),
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Modalities
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {center.modalities.map((m) => (
              <Chip key={m}>{m}</Chip>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Subspecialties
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {center.subspecialties.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              Next available
            </div>
            <div className="mt-1 inline-flex items-center gap-1.5 text-slate-900">
              <CalendarCheck className="h-4 w-4 text-emerald-500" />
              {center.nextAvailableHours <= 4
                ? "Today"
                : center.nextAvailableHours <= 24
                  ? "Tomorrow"
                  : `${Math.round(center.nextAvailableHours / 24)} days`}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              MRI estimate
            </div>
            <div className="mt-1 inline-flex items-center gap-1 text-slate-900">
              <DollarSign className="h-4 w-4 text-slate-400" />
              {center.estimatedMriCostUSD.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              Walk-ins
            </div>
            <div className="mt-1 text-slate-900">
              {center.acceptsWalkIns ? "Accepted" : "By appointment"}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              On-site radiologist
            </div>
            <div className="mt-1 text-slate-900">
              {center.hasOnsiteRadiologist ? "Yes" : "No"}
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            In-network insurance
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {center.inNetworkInsurance.map((p) => (
              <Chip key={p}>{p}</Chip>
            ))}
          </div>
        </section>

        <section className="space-y-1.5 text-sm text-slate-700">
          <div className="inline-flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-400" />
            <a className="hover:underline" href={`tel:${center.phone}`}>
              {center.phone}
            </a>
          </div>
          <div className="inline-flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span>{center.hours}</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-slate-400" />
            <span>
              {center.subspecialties.length} subspecialties ·{" "}
              {center.modalities.length} modalities
            </span>
          </div>
        </section>
      </div>

      <div className="border-t border-slate-200 bg-white p-3">
        <button
          type="button"
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Send referral
        </button>
      </div>
    </div>
  );
}
