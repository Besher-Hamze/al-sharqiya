"use client";

import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/use-t";
import type { QuoteStatus } from "@/lib/types";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}

const quoteStatusStyles: Record<QuoteStatus, string> = {
  new: "border-amber-200 bg-amber-50 text-amber-700",
  contacted: "border-sky-200 bg-sky-50 text-sky-700",
  quoted: "border-violet-200 bg-violet-50 text-violet-700",
  won: "border-emerald-200 bg-emerald-50 text-emerald-700",
  lost: "border-zinc-200 bg-zinc-100 text-zinc-500",
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const t = useT();
  return (
    <Badge className={quoteStatusStyles[status]}>
      <span className="size-1.5 rounded-full bg-current" />
      {t(`quoteStatus.${status}`)}
    </Badge>
  );
}
