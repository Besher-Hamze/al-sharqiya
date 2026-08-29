"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "@/components/sections/project-card";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

export function ProjectFilter({
  projects,
  services,
}: {
  projects: Project[];
  services: { slug: string; label: string }[];
}) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [active, setActive] = useState<string>("all");

  // Only offer filters that actually have published projects behind them.
  const tabs = useMemo(() => {
    const used = new Set(projects.map((p) => p.serviceSlug));
    return [
      { slug: "all", label: t("filterAll") },
      ...services.filter((s) => used.has(s.slug)),
    ];
  }, [projects, services, t]);

  const visible =
    active === "all"
      ? projects
      : projects.filter((p) => p.serviceSlug === active);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => setActive(tab.slug)}
            aria-pressed={active === tab.slug}
            className={cn(
              "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
              active === tab.slug
                ? "text-graphite-950"
                : "text-graphite-600 hover:text-gold-700",
            )}
          >
            {active === tab.slug ? (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-gold-500 shadow-soft"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            ) : null}
            {tab.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink-400">{t("empty")}</p>
      ) : (
        <motion.div
          layout
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <ProjectCard project={project} locale={locale} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
