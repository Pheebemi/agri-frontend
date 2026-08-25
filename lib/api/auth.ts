import { api, tokens } from "./client";
import type { User } from "./types";

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirm: string;
  full_name: string;
  phone?: string;
  farm_name?: string;
  region?: string;
}

export async function login(email: string, password: string): Promise<User> {
  const data = await api.post<LoginResponse>(
    "/auth/login/",
    { email, password },
    { auth: false },
  );
  tokens.set(data.access, data.refresh);
  return data.user;
}

export async function register(payload: RegisterPayload): Promise<User> {
  return api.post<User>("/auth/register/", payload, { auth: false });
}

export async function fetchMe(): Promise<User> {
  return api.get<User>("/auth/me/");
}

export async function updateMe(payload: Partial<User>): Promise<User> {
  return api.patch<User>("/auth/me/", payload);
}

export function logout() {
  tokens.clear();
}
