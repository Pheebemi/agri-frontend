import { api } from "./client";
import type { Farm, FarmDetail, FarmSummary, Paginated } from "./types";

export function listFarms() {
  return api.get<Paginated<Farm>>("/farms/");
}

export function getFarm(id: number | string) {
  return api.get<FarmDetail>(`/farms/${id}/`);
}

export interface FarmInput {
  name: string;
  crops?: string;
}

export function createFarm(input: FarmInput) {
  return api.post<FarmDetail>("/farms/", input);
}

export function updateFarm(id: number, input: Partial<FarmInput>) {
  return api.patch<FarmDetail>(`/farms/${id}/`, input);
}

export function deleteFarm(id: number) {
  return api.delete(`/farms/${id}/`);
}

export interface SummaryFilters {
  farm?: number;
  date__gte?: string;
  date__lte?: string;
}

function toQuery(filters: SummaryFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.farm) params.set("farm", String(filters.farm));
  if (filters.date__gte) params.set("date__gte", filters.date__gte);
  if (filters.date__lte) params.set("date__lte", filters.date__lte);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function getFarmSummary(filters?: SummaryFilters) {
  return api.get<FarmSummary>(`/farms/summary/${toQuery(filters)}`);
}
