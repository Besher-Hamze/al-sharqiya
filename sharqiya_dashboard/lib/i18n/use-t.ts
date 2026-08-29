"use client";

import { useLocaleStore } from "@/lib/stores/locale-store";
import { getMessage } from "./get-message";

export function useT() {
  const locale = useLocaleStore((s) => s.locale);
  return (key: string, params?: Record<string, string | number>) =>
    getMessage(locale, key, params);
}

export function useDashboardLocale() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  return { locale, setLocale, dir: locale === "ar" ? "rtl" : "ltr" } as const;
}

export type PageKey =
  | "overview"
  | "quotes"
  | "messages"
  | "services"
  | "projects"
  | "content"
  | "pages"
  | "gallery"
  | "media"
  | "testimonials"
  | "faq"
  | "navigation"
  | "settings"
  | "users"
  | "activity";
