"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn, loc } from "@/lib/utils";
import type { Faq } from "@/lib/types";

export function FaqAccordion({
  faqs,
  defaultOpen = 0,
}: {
  faqs: Faq[];
  /** Index to expand on mount; pass `-1` to start fully collapsed. */
  defaultOpen?: number;
}) {
  const locale = useLocale();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="divide-y divide-ink-200 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-200/70">
      {faqs.map((faq, i) => {
        const expanded = open === i;
        return (
          <div key={faq._id ?? i}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? -1 : i)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-start transition hover:bg-gold-50/60 sm:px-6"
              >
                <span
                  className={cn(
                    "font-display text-base font-semibold transition-colors sm:text-lg",
                    expanded ? "text-gold-700" : "text-graphite-950",
                  )}
                >
                  {loc(faq.question, locale)}
                </span>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                    expanded
                      ? "rotate-45 bg-gold-500 text-graphite-950"
                      : "bg-ink-100 text-graphite-600",
                  )}
                  aria-hidden
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-6 text-sm leading-relaxed text-ink-500 sm:px-6 sm:text-[15px]">
                    {loc(faq.answer, locale)}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
