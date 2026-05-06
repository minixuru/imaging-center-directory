export type Modality =
  | "MRI"
  | "CT"
  | "X-Ray"
  | "Ultrasound"
  | "Mammography"
  | "PET-CT"
  | "Fluoroscopy"
  | "DEXA";

export type Subspecialty =
  | "Neuro"
  | "MSK"
  | "Body"
  | "Breast"
  | "Cardiac"
  | "Pediatric";

export type InsurancePlan =
  | "Aetna"
  | "Anthem"
  | "BlueCross"
  | "Cigna"
  | "Humana"
  | "Medicare"
  | "Medicaid"
  | "UnitedHealth";

export type Coords = { lat: number; lng: number };

export type ImagingCenter = {
  id: string;
  name: string;
  address: {
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  coords: Coords;
  phone: string;
  hours: string;
  modalities: Modality[];
  subspecialties: Subspecialty[];
  /** 1.0 - 5.0 */
  patientRating: number;
  reviewCount: number;
  /** Median hours from scan to final report. */
  avgTurnaroundHours: number;
  /** Hours until next open appointment. 0 = today. */
  nextAvailableHours: number;
  acceptsWalkIns: boolean;
  inNetworkInsurance: InsurancePlan[];
  /** Typical patient out-of-pocket for an MRI w/o contrast, USD. */
  estimatedMriCostUSD: number;
  hasOnsiteRadiologist: boolean;
  /** Uses Expert Radiology PrecisionPlus reporting. Boosts business value. */
  isExpertRadiologyPartner: boolean;
};

/** A search request from a referring provider. */
export type SearchInput = {
  /** Free-text location (zip, neighborhood, or city). */
  location: string;
  /** Modality the patient needs. Empty = any. */
  modality: Modality | "";
  /** Patient's insurance plan. Empty = unknown. */
  insurance: InsurancePlan | "";
};

/** Weights are normalized; 0..1 each. The UI lets the user tune them. */
export type RankingWeights = {
  distance: number;
  quality: number;
  turnaround: number;
  cost: number;
  availability: number;
  partner: number;
};

export type ScoredCenter = {
  center: ImagingCenter;
  /** Distance from patient origin in miles. */
  distanceMiles: number;
  /** 0..100 composite score. Higher is better. */
  score: number;
  /** Per-factor 0..100 sub-scores for transparency. */
  breakdown: {
    distance: number;
    quality: number;
    turnaround: number;
    cost: number;
    availability: number;
    partner: number;
  };
  /** True iff center is in-network for the searcher's plan. */
  inNetwork: boolean;
  /** True iff center offers the requested modality. */
  modalityMatch: boolean;
};
