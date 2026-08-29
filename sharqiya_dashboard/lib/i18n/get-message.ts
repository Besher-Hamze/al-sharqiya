import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import type { DashboardLocale } from "@/lib/stores/locale-store";

const catalogs: Record<DashboardLocale, Record<string, unknown>> = { en, ar };

export function getMessage(
  locale: DashboardLocale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const parts = key.split(".");
  let value: unknown = catalogs[locale];

  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }

  if (typeof value !== "string") return key;
  if (!params) return value;

  return value.replace(/\{(\w+)\}/g, (_, name: string) =>
    String(params[name] ?? `{${name}}`),
  );
}
