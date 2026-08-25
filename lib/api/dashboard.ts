import { api } from "./client";
import type { AdminDashboard, FarmerDashboard, Paginated, User } from "./types";

export function getFarmerDashboard() {
  return api.get<FarmerDashboard>("/dashboard/farmer/");
}

export function getAdminDashboard() {
  return api.get<AdminDashboard>("/dashboard/admin/");
}

export function listUsers(filters: { role?: string; search?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.role) params.set("role", filters.role);
  if (filters.search) params.set("search", filters.search);
  const query = params.toString();
  return api.get<Paginated<User>>(`/auth/users/${query ? `?${query}` : ""}`);
}
