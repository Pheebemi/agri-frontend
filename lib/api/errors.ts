export function apiError(error: unknown, fallback: string): Error {
  if (error instanceof Error && error.message) return error;
  return new Error(fallback);
}

export function errorMessage(error: unknown, fallback: string): string {
  return apiError(error, fallback).message;
}

/**
 * DRF returns validation errors as {field: [messages]} and everything else as
 * {detail: message}. Flatten both into one readable line so a toast can show it
 * without the caller unpacking shapes.
 */
export function readDrfError(body: unknown, fallback: string): string {
  if (typeof body === "string" && body) return body;
  if (!body || typeof body !== "object") return fallback;

  const record = body as Record<string, unknown>;
  if (typeof record.detail === "string") return record.detail;

  const parts: string[] = [];
  for (const [field, value] of Object.entries(record)) {
    const messages = Array.isArray(value) ? value : [value];
    for (const message of messages) {
      if (typeof message !== "string") continue;
      parts.push(field === "non_field_errors" ? message : `${humanize(field)}: ${message}`);
    }
  }
  return parts.length ? parts.join(" ") : fallback;
}

function humanize(field: string) {
  return field.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}
