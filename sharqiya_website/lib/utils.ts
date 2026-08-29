import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LocalizedString } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Resolve a localized field for the active locale, falling back to English. */
export function loc(
  value: LocalizedString | string | undefined | null,
  locale: string,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale as keyof LocalizedString] || value.en || "";
}

/** Strips everything but digits so a phone number can be used in a wa.me link. */
export function waLink(phone: string | undefined | null): string {
  return `https://wa.me/${(phone ?? "").replace(/\D/g, "")}`;
}

/** Sorts by an optional `order` field without mutating the input. */
export function byOrder<T extends { order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3018";

export const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3020";
