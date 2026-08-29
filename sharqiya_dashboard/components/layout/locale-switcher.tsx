"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardLocale, useT } from "@/lib/i18n/use-t";

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const { locale, setLocale } = useDashboardLocale();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5",
        compact && "scale-95",
      )}
      role="group"
      aria-label={t("common.language")}
    >
      <Globe className="mx-1 size-3.5 text-zinc-400" aria-hidden />
      {(["en", "ar"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={cn(
            "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition",
            locale === l
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700",
          )}
        >
          {l === "en" ? t("common.english") : t("common.arabic")}
        </button>
      ))}
    </div>
  );
}
