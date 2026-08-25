export type Role = "FARMER" | "AGRONOMIST";

export type SeverityLevel = "HEALTHY" | "MILD" | "MODERATE" | "SEVERE" | "CRITICAL";

export type ScanStatus =
  | "PENDING"
  | "ANALYZING"
  | "COMPLETE"
  | "NEEDS_REVIEW"
  | "FAILED";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  phone: string;
  farm_name: string;
  region: string;
  avatar: string | null;
  initials: string;
  primary_crops: number[];
  primary_crop_names: string[];
  date_joined: string;
  is_active: boolean;
}

export interface Crop {
  id: number;
  name: string;
  slug: string;
  scientific_name: string;
  family: string;
  description: string;
  image: string | null;
  growing_season: string;
  disease_count: number;
}

export interface CropDetail extends Crop {
  diseases: Disease[];
}

export interface Treatment {
  id: number;
  approach: "ORGANIC" | "CHEMICAL" | "PREVENTIVE" | "IMMEDIATE";
  approach_display: string;
  title: string;
  instructions: string;
  materials: string;
  materials_list: string[];
  timeframe: string;
  order: number;
}

export interface Disease {
  id: number;
  name: string;
  slug: string;
  crop: number;
  crop_name: string;
  crop_slug: string;
  kind: string;
  kind_display: string;
  pathogen: string;
  default_severity: SeverityLevel;
  summary: string;
  reference_image: string | null;
  symptoms?: string;
  symptoms_list?: string[];
  causes?: string;
  causes_list?: string[];
  spread?: string;
  treatments?: Treatment[];
}

export interface DiagnosisCandidate {
  id: number;
  disease: number | null;
  disease_name: string;
  disease_slug: string;
  raw_label: string;
  confidence: number;
  confidence_percent: number;
}

export interface Diagnosis {
  id: number;
  disease: Disease | null;
  corrected_disease: Disease | null;
  identified_crop: number | null;
  identified_crop_name: string;
  raw_label: string;
  confidence: number;
  confidence_percent: number;
  severity: SeverityLevel;
  severity_display: string;
  affected_area: number;
  affected_area_percent: number;
  summary: string;
  provider: string;
  model_version: string;
  needs_review: boolean;
  is_healthy: boolean;
  reviewed_by: number | null;
  reviewed_by_name: string;
  reviewed_at: string | null;
  review_notes: string;
  candidates: DiagnosisCandidate[];
  treatments: Treatment[];
  created_at: string;
}

export interface Scan {
  id: number;
  image: string;
  status: ScanStatus;
  status_display: string;
  crop_name: string;
  disease_name: string;
  severity: SeverityLevel | "";
  confidence_percent: number;
  region: string;
  user: number;
  user_email: string;
  created_at: string;
  analyzed_at: string | null;
}

export interface ScanDetail extends Scan {
  declared_crop: number | null;
  declared_crop_name: string;
  notes: string;
  latitude: number | null;
  longitude: number | null;
  error_message: string;
  diagnosis: Diagnosis | null;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SeverityBucket {
  severity: SeverityLevel;
  label: string;
  count: number;
}

export interface ActivityPoint {
  date: string;
  count: number;
}

export interface FarmerDashboard {
  totals: {
    scans: number;
    healthy: number;
    needs_attention: number;
    health_rate: number;
    pending_review: number;
  };
  severity_breakdown: SeverityBucket[];
  scan_activity: ActivityPoint[];
  recent_scans: Scan[];
  top_issues: { disease: string; slug: string; crop: string; count: number }[];
}

export interface AdminDashboard {
  totals: {
    users: number;
    farmers: number;
    agronomists: number;
    scans: number;
    scans_this_week: number;
    crops: number;
    diseases: number;
    pending_review: number;
  };
  severity_breakdown: SeverityBucket[];
  scan_activity: ActivityPoint[];
  outbreaks: {
    disease: string;
    slug: string;
    crop: string;
    count: number;
    recent: number;
    avg_confidence: number;
  }[];
  by_region: { region: string; count: number; unhealthy: number }[];
  review_queue: Scan[];
}
