"use client";

import {
  ArrowLeft,
  Award,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Footprints,
  Navigation,
  Phone,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import { FACTOR_LABELS } from "@/lib/ranking";
import type { ScoredCenter } from "@/lib/types";
import { cn } from "@/lib/cn";
import {
  MODALITY_STYLE,
  accreditationLabel,
  formatHour,
  formatNextAvailable,
  gradientFor,
  initialsFor,
  isOpenNow,
} from "@/lib/visuals";
import { Stars } from "./Stars";

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
            "h-full rounded-full transition-all",
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

function ActionButton({
  href,
  icon: Icon,
  label,
  primary,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-xs font-medium transition",
        primary
          ? "bg-slate-900 text-white hover:bg-slate-800"
          : "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}

export function CenterDetail({ scored, onClose }: Props) {
  const { center, distanceMiles, score, breakdown, inNetwork, modalityMatch } =
    scored;
  const grad = gradientFor(center.id);
  const initials = initialsFor(center.name);
  const open = isOpenNow(center);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${center.coords.lat},${center.coords.lng}`;
  const visibleAccs = center.accreditations.slice(0, 4);
  const hiddenAccs = center.accreditations.length - visibleAccs.length;

  return (
    <div className="flex h-full flex-col">
      {/* Hero with gradient + initials */}
      <div
        className="relative shrink-0 px-4 pb-12 pt-3 text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
        }}
      >
        <div className="flex items-start justify-between">
          <button
            type="button"
            onClick={onClose}
            className="-ml-1 inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-white/90 hover:bg-white/15 hover:text-white"
            aria-label="Back to list"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-white/80 hover:bg-white/15 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex items-end gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/25 text-xl font-semibold text-white backdrop-blur">
            {initials}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <h2 className="truncate text-base font-semibold leading-tight">
              {center.name}
            </h2>
            <p className="mt-0.5 truncate text-xs text-white/80">
              {center.address.line1}
            </p>
            <p className="truncate text-xs text-white/70">
              {center.address.city}, {center.address.state} {center.address.zip}
            </p>
          </div>
        </div>
      </div>

      {/* Floating score badge */}
      <div className="relative -mt-7 flex shrink-0 items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-slate-200">
          <div className="text-center">
            <div className="text-2xl font-semibold leading-none tabular-nums text-slate-900">
              {score}
            </div>
            <div className="mt-0.5 text-[9px] uppercase tracking-wide text-slate-500">
              composite
            </div>
          </div>
          <div className="h-9 w-px bg-slate-200" />
          <div className="text-xs">
            <div className="inline-flex items-center gap-1">
              <Stars value={center.patientRating} size={12} />
              <span className="font-medium tabular-nums text-slate-900">
                {center.patientRating.toFixed(1)}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {center.reviewCount} reviews · {distanceMiles.toFixed(1)} mi
            </div>
          </div>
        </div>
        {center.isExpertRadiologyPartner && (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-200">
            <Award className="h-3 w-3" />
            ER Partner
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="shrink-0 px-4 pt-3">
        <div className="flex gap-2">
          <ActionButton
            href={`tel:${center.phone}`}
            icon={Phone}
            label="Call"
          />
          <ActionButton
            href={directionsUrl}
            icon={Navigation}
            label="Directions"
          />
          <ActionButton href="#" icon={CheckCircle2} label="Refer" primary />
        </div>
      </div>

      {/* Scrollable body */}
      <div className="mt-3 flex-1 space-y-5 overflow-y-auto px-4 pb-4">
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

        <section className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-xs">
          <div className="flex items-start gap-2 p-1.5">
            <div className="mt-0.5">
              {open.open ? (
                <span className="block h-2 w-2 rounded-full bg-emerald-500" />
              ) : (
                <span className="block h-2 w-2 rounded-full bg-slate-400" />
              )}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">
                Status
              </div>
              <div className="mt-0.5 font-medium text-slate-900">
                {open.open
                  ? `Open until ${formatHour(open.closesAt!)}`
                  : open.opensAt
                    ? `Opens ${formatHour(open.opensAt)}`
                    : "Closed today"}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 p-1.5">
            <CalendarCheck className="mt-0.5 h-4 w-4 text-emerald-500" />
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">
                Next available
              </div>
              <div className="mt-0.5 font-medium text-slate-900">
                {formatNextAvailable(center.nextAvailableHours)}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 p-1.5">
            <Clock className="mt-0.5 h-4 w-4 text-slate-400" />
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">
                Turnaround
              </div>
              <div className="mt-0.5 font-medium text-slate-900">
                ~{center.avgTurnaroundHours}h to report
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 p-1.5">
            <DollarSign className="mt-0.5 h-4 w-4 text-slate-400" />
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">
                MRI estimate
              </div>
              <div className="mt-0.5 font-medium text-slate-900">
                ${center.estimatedMriCostUSD.toLocaleString()}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Score breakdown
          </h3>
          <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-3">
            {(Object.keys(breakdown) as Array<keyof typeof breakdown>).map(
              (k) => (
                <ScoreBar
                  key={k}
                  label={FACTOR_LABELS[k]}
                  value={breakdown[k]}
                />
              ),
            )}
          </div>
        </section>

        {center.accreditations.length > 0 && (
          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Accreditations
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {visibleAccs.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200"
                >
                  <ShieldCheck className="h-3 w-3" />
                  {accreditationLabel(a)}
                </span>
              ))}
              {hiddenAccs > 0 && (
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                  +{hiddenAccs} more
                </span>
              )}
            </div>
          </section>
        )}

        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Modalities
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {center.modalities.map((m) => (
              <span
                key={m}
                className={cn(
                  "rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                  MODALITY_STYLE[m],
                )}
              >
                {m}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Subspecialties
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {center.subspecialties.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            In-network insurance
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {center.inNetworkInsurance.map((p) => (
              <span
                key={p}
                className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
              >
                {p}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
          <div className="inline-flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-400" />
            <a className="hover:underline" href={`tel:${center.phone}`}>
              {center.phone}
            </a>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <span className="text-xs leading-relaxed">{center.hours}</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Footprints className="h-4 w-4 text-slate-400" />
            <span className="text-xs">
              {center.acceptsWalkIns ? "Walk-ins accepted" : "By appointment"}
            </span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-slate-400" />
            <span className="text-xs">
              {center.hasOnsiteRadiologist
                ? "On-site radiologist"
                : "Reads off-site"}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
