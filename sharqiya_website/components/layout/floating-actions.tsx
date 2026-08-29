"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { waLink } from "@/lib/utils";

export function FloatingActions({
  whatsapp,
  phone,
}: {
  whatsapp: string;
  phone: string;
}) {
  const t = useTranslations("common");
  const tn = useTranslations("nav");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 end-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTop ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-graphite-800 shadow-lift ring-1 ring-ink-200 backdrop-blur transition hover:text-gold-700"
          >
            <ArrowUp className="h-5 w-5" aria-hidden />
          </motion.button>
        ) : null}
      </AnimatePresence>

      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        aria-label={tn("callUs")}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-graphite-900 text-white shadow-lift transition hover:bg-graphite-800 sm:hidden"
      >
        <Phone className="h-5 w-5" aria-hidden />
      </a>

      <a
        href={waLink(whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("whatsapp")}
        className="group flex h-13 items-center gap-2.5 rounded-full bg-[#25D366] px-4 text-white shadow-lift transition hover:brightness-105"
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-500 group-hover:max-w-[10rem] sm:block">
          {t("whatsapp")}
        </span>
      </a>
    </div>
  );
}
