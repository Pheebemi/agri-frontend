import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const INTERVALS: [seconds: number, unit: string][] = [
  [31536000, "year"],
  [2592000, "month"],
  [604800, "week"],
  [86400, "day"],
  [3600, "hour"],
  [60, "minute"],
];

/** "3 hours ago", "2 days ago" — short enough for a table cell. */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";

  for (const [size, unit] of INTERVALS) {
    if (seconds >= size) {
      const value = Math.floor(seconds / size);
      return `${value} ${value === 1 ? unit : `${unit}s`} ago`;
    }
  }
  return "just now";
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });

export function formatMoney(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(value)) return money.format(0);
  return money.format(value);
}

/** Absolute URL for a media path returned by Django. */
export function mediaUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://localhost:8000";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
