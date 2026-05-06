"use client";

import { MapPin } from "lucide-react";
import { Select, type SelectOption } from "./Select";
import type { InsurancePlan, Modality, SearchInput } from "@/lib/types";

const MODALITY_OPTIONS: SelectOption<Modality | "">[] = [
  { value: "", label: "Any modality" },
  { value: "MRI", label: "MRI" },
  { value: "CT", label: "CT" },
  { value: "X-Ray", label: "X-Ray" },
  { value: "Ultrasound", label: "Ultrasound" },
  { value: "Mammography", label: "Mammography" },
  { value: "PET-CT", label: "PET-CT" },
  { value: "Fluoroscopy", label: "Fluoroscopy" },
  { value: "DEXA", label: "DEXA" },
];

const INSURANCE_OPTIONS: SelectOption<InsurancePlan | "">[] = [
  { value: "", label: "Any insurance" },
  { value: "Aetna", label: "Aetna" },
  { value: "Anthem", label: "Anthem" },
  { value: "BlueCross", label: "BlueCross" },
  { value: "Cigna", label: "Cigna" },
  { value: "Humana", label: "Humana" },
  { value: "Medicare", label: "Medicare" },
  { value: "Medicaid", label: "Medicaid" },
  { value: "UnitedHealth", label: "UnitedHealth" },
];

type Props = {
  value: SearchInput;
  onChange: (next: SearchInput) => void;
};

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <label className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
        <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
        <input
          className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
          placeholder="Patient location (zip, neighborhood, city)"
          value={value.location}
          onChange={(e) => onChange({ ...value, location: e.target.value })}
        />
      </label>
      <Select<Modality | "">
        value={value.modality}
        options={MODALITY_OPTIONS}
        onChange={(modality) => onChange({ ...value, modality })}
        ariaLabel="Modality"
        className="md:w-44"
      />
      <Select<InsurancePlan | "">
        value={value.insurance}
        options={INSURANCE_OPTIONS}
        onChange={(insurance) => onChange({ ...value, insurance })}
        ariaLabel="Insurance"
        className="md:w-48"
      />
    </div>
  );
}
