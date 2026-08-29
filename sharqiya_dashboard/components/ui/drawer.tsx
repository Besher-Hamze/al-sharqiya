"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useDashboardLocale, useT } from "@/lib/i18n/use-t";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  widthClass?: string;
  footer?: React.ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  widthClass = "max-w-2xl",
  footer,
}: DrawerProps) {
  const t = useT();
  const { dir } = useDashboardLocale();
  const offScreen = dir === "rtl" ? "-100%" : "100%";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: offScreen }}
            animate={{ x: 0 }}
            exit={{ x: offScreen }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            className={cn(
              "absolute inset-y-0 end-0 flex w-full flex-col border-s border-zinc-200 bg-white shadow-2xl",
              widthClass,
            )}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3.5">
              <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                aria-label={t("aria.close")}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-2 border-t border-zinc-100 bg-zinc-50/60 px-5 py-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
