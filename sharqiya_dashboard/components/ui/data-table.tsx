"use client";

import { ChevronLeft, ChevronRight, Inbox, LoaderCircle } from "lucide-react";
import type { PaginationMeta } from "@/lib/types";
import { useT } from "@/lib/i18n/use-t";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string | undefined;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  emptyText,
  onRowClick,
  rowClassName,
  meta,
  onPageChange,
}: DataTableProps<T>) {
  const t = useT();
  const resolvedEmpty = emptyText ?? t("common.noData");

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/70">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-2.5 text-xs font-medium text-zinc-500",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-14 text-center">
                  <LoaderCircle className="mx-auto size-5 animate-spin text-zinc-400" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-14 text-center">
                  <Inbox className="mx-auto mb-2 size-6 text-zinc-300" />
                  <p className="text-sm text-zinc-400">{resolvedEmpty}</p>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b border-zinc-50 transition-colors last:border-0 hover:bg-zinc-50/60",
                    onRowClick && "cursor-pointer",
                    rowClassName?.(row),
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3", col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {meta && meta.pages > 1 && onPageChange && (
        <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-2.5">
          <span className="text-xs text-zinc-500">
            {t("pagination.summary", {
              total: meta.total,
              page: meta.page,
              pages: meta.pages,
            })}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={t("aria.prevPage")}
            >
              <ChevronLeft className="size-4 rtl:rotate-180" />
            </button>
            <button
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.pages}
              className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={t("aria.nextPage")}
            >
              <ChevronRight className="size-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
