import { readDrfError } from "./errors";

export const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const ACCESS_KEY = "agriscan.access";
const REFRESH_KEY = "agriscan.refresh";

export const tokens = {
  access: () => (typeof window === "undefined" ? null : localStorage.getItem(ACCESS_KEY)),
  refresh: () => (typeof window === "undefined" ? null : localStorage.getItem(REFRESH_KEY)),
  set(access: string, refresh?: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
  /** Internal: stops a refresh loop when the refresh call itself 401s. */
  retrying?: boolean;
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = tokens.refresh();
  if (!refresh) return false;

  const response = await fetch(`${BASE}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) {
    tokens.clear();
    return false;
  }
  const data = (await response.json()) as { access: string; refresh?: string };
  tokens.set(data.access, data.refresh);
  return true;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, retrying = false, headers, ...rest } = options;

  const isFormData = body instanceof FormData;
  const requestHeaders = new Headers(headers);
  // Let the browser set the multipart boundary; setting it by hand breaks uploads.
  if (body !== undefined && !isFormData) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (auth) {
    const access = tokens.access();
    if (access) requestHeaders.set("Authorization", `Bearer ${access}`);
  }

  const response = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  // One transparent refresh, then give up — otherwise an expired refresh token
  // spins forever.
  if (response.status === 401 && auth && !retrying) {
    if (await refreshAccessToken()) {
      return request<T>(path, { ...options, retrying: true });
    }
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  const parsed: unknown = text ? safeJson(text) : null;

  if (!response.ok) {
    throw new ApiError(
      readDrfError(parsed, `Request failed (${response.status})`),
      response.status,
      parsed,
    );
  }
  return parsed as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
