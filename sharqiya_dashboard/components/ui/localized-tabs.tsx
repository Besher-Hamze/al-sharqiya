"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

type Lang = "en" | "ar";

const LangContext = createContext<Lang>("en");

export function useCurrentLang(): Lang {
  return useContext(LangContext);
}

interface LocalizedTabsProps {
  children: (lang: Lang) => React.ReactNode;
  className?: string;
}

export function LocalizedTabs({ children, className }: LocalizedTabsProps) {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <div className={className}>
      <div className="mb-3 inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
        {(["en", "ar"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={cn(
              "cursor-pointer rounded-md px-3.5 py-1 text-xs font-medium transition",
              lang === l
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            {l === "en" ? "English" : "العربية"}
          </button>
        ))}
      </div>
      <LangContext.Provider value={lang}>
        {(["en", "ar"] as const).map((l) => (
          <div key={l} className={cn(l !== lang && "hidden")}>
            {children(l)}
          </div>
        ))}
      </LangContext.Provider>
    </div>
  );
}
