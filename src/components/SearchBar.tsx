"use client";

import { MapPin } from "lucide-react";
import type { InsurancePlan, Modality, SearchInput } from "@/lib/types";

const MODALITIES: Modality[] = [
  "MRI",
  "CT",
  "X-Ray",
  "Ultrasound",
  "Mammography",
  "PET-CT",
  "Fluoroscopy",
  "DEXA",
];

const INSURANCE_PLANS: InsurancePlan[] = [
  "Aetna",
  "Anthem",
  "BlueCross",
  "Cigna",
  "Humana",
  "Medicare",
  "Medicaid",
  "UnitedHealth",
];

type Props = {
  value: SearchInput;
  onChange: (next: SearchInput) => void;
};

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <label className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-slate-400 focus-within:bg-white">
        <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
        <input
          className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
          placeholder="Patient location (zip, neighborhood, city)"
          value={value.location}
          onChange={(e) => onChange({ ...value, location: e.target.value })}
        />
      </label>
      <select
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 md:w-44"
        value={value.modality}
        onChange={(e) =>
          onChange({ ...value, modality: e.target.value as Modality | "" })
        }
        aria-label="Modality"
      >
        <option value="">Any modality</option>
        {MODALITIES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 md:w-48"
        value={value.insurance}
        onChange={(e) =>
          onChange({
            ...value,
            insurance: e.target.value as InsurancePlan | "",
          })
        }
        aria-label="Insurance"
      >
        <option value="">Any insurance</option>
        {INSURANCE_PLANS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
}
