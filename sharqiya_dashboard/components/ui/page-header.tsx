"use client";

import { useT, type PageKey } from "@/lib/i18n/use-t";

interface PageHeaderProps {
  page?: PageKey;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  page,
  title,
  description,
  actions,
}: PageHeaderProps) {
  const t = useT();
  const resolvedTitle = title ?? (page ? t(`pages.${page}.title`) : "");
  const resolvedDescription =
    description ?? (page ? t(`pages.${page}.description`) : undefined);

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          {resolvedTitle}
        </h1>
        {resolvedDescription ? (
          <p className="mt-0.5 text-sm text-zinc-500">{resolvedDescription}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
