import { api, ApiError, BASE, tokens } from "./client";
import { readDrfError } from "./errors";
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

/**
 * Spoken audio of a scan's diagnosis report, generated server-side (see
 * agri-backend `apps/scans/speech.py`) so Pidgin and Hausa get real voices
 * instead of whatever the visitor's browser happens to ship. Always reads
 * the diagnosis in the scan's own language — the diagnosis text itself only
 * ever exists in whatever language the scan was last analysed in, so there
 * is no separate "playback language" to request here.
 */
export async function fetchScanSpeech(id: number | string): Promise<Blob> {
  const headers = new Headers();
  const access = tokens.access();
  if (access) headers.set("Authorization", `Bearer ${access}`);

  // The URL is the same every time for a given scan, but what it returns
  // isn't — a re-analysis changes the diagnosis language and regenerates the
  // clip server-side. `no-store` stops the browser from silently replaying
  // whatever audio it cached the first time this URL was ever fetched.
  const response = await fetch(`${BASE}/scans/${id}/speech/`, { headers, cache: "no-store" });

  if (!response.ok) {
    const text = await response.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }
    throw new ApiError(
      readDrfError(parsed, `Couldn't generate audio (${response.status})`),
      response.status,
      parsed,
    );
  }

  return response.blob();
}

export function reviewScan(
  id: number,
  payload: { corrected_disease?: number | null; severity?: string; review_notes?: string },
) {
  return api.post(`/scans/${id}/review/`, payload);
}
