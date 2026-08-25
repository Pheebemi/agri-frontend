import { api } from "./client";
import type { Crop, CropDetail, Disease, Paginated } from "./types";

export function listCrops(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return api.get<Paginated<Crop>>(`/catalog/crops/${query}`);
}

export function getCrop(slug: string) {
  return api.get<CropDetail>(`/catalog/crops/${slug}/`);
}

export function listDiseases(filters: { crop?: string; search?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.crop) params.set("crop", filters.crop);
  if (filters.search) params.set("search", filters.search);
  const query = params.toString();
  return api.get<Paginated<Disease>>(`/catalog/diseases/${query ? `?${query}` : ""}`);
}

export function getDisease(slug: string) {
  return api.get<Disease>(`/catalog/diseases/${slug}/`);
}
