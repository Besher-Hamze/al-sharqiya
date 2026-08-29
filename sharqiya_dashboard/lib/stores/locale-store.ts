import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DashboardLocale = "en" | "ar";

interface LocaleState {
  locale: DashboardLocale;
  setLocale: (locale: DashboardLocale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
    }),
    { name: "sharqiya-dashboard-locale" },
  ),
);
