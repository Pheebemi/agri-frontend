import { api } from "./client";
import type { Language, Paginated, Scan, ScanDetail } from "./types";

export interface ScanFilters {
  status?: string;
  severity?: string;
  crop?: string;
  mine?: boolean;
  page?: number;
}

function toQuery(filters: ScanFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.severity) params.set("severity", filters.severity);
  if (filters.crop) params.set("crop", filters.crop);
  if (filters.mine) params.set("mine", "true");
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function listScans(filters?: ScanFilters) {
  return api.get<Paginated<Scan>>(`/scans/${toQuery(filters)}`);
}

export function getScan(id: number | string) {
  return api.get<ScanDetail>(`/scans/${id}/`);
}

export interface CreateScanInput {
  image: File;
  declaredCrop?: number | null;
  language: Language;
  notes?: string;
  region?: string;
}

export function createScan(input: CreateScanInput) {
  const form = new FormData();
  form.append("image", input.image);
  if (input.declaredCrop) form.append("declared_crop", String(input.declaredCrop));
  form.append("language", input.language);
  if (input.notes) form.append("notes", input.notes);
  if (input.region) form.append("region", input.region);
  return api.post<ScanDetail>("/scans/", form);
}

/** Omit `language` to re-run in whatever language the scan already has. */
export function reanalyzeScan(id: number, language?: Language) {
  const form = new FormData();
  if (language) form.append("language", language);
  return api.post<ScanDetail>(`/scans/${id}/reanalyze/`, form);
}

export function reviewScan(
  id: number,
  payload: { corrected_disease?: number | null; severity?: string; review_notes?: string },
) {
  return api.post(`/scans/${id}/review/`, payload);
}
