"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleAlert, X } from "lucide-react";
import { useToastStore, type Toast } from "@/lib/stores/toast-store";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/use-t";

const styles: Record<Toast["variant"], string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-zinc-200 bg-white text-zinc-800",
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();
  const t = useT();

  return (
    <div className="pointer-events-none fixed bottom-4 end-4 z-[100] flex w-80 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "pointer-events-auto flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm shadow-lg shadow-zinc-900/5",
              styles[item.variant],
            )}
          >
            {item.variant === "success" && (
              <Check className="mt-0.5 size-4 shrink-0" />
            )}
            {item.variant === "error" && (
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
            )}
            <span className="flex-1 leading-snug">{item.message}</span>
            <button
              onClick={() => dismiss(item.id)}
              className="shrink-0 rounded p-0.5 opacity-60 transition hover:opacity-100"
              aria-label={t("aria.close")}
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
