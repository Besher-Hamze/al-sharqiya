"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import type { AuditLog, Paginated } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { useTableLabels } from "@/lib/i18n/use-table-labels";
import { useDashboardLocale, useT } from "@/lib/i18n/use-t";

const methodStyles: Record<string, string> = {
  POST: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PATCH: "border-sky-200 bg-sky-50 text-sky-700",
  PUT: "border-sky-200 bg-sky-50 text-sky-700",
  DELETE: "border-red-200 bg-red-50 text-red-700",
};

export default function ActivityPage() {
  const t = useT();
  const tbl = useTableLabels();
  const { locale } = useDashboardLocale();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["audit", page, search],
    queryFn: async () =>
      (
        await api.get<Paginated<AuditLog>>("/audit", {
          params: { page, limit: 30, ...(search ? { search } : {}) },
        })
      ).data,
  });

  const columns: Column<AuditLog>[] = [
    {
      key: "time",
      header: tbl.timestamp,
      className: "w-44",
      render: (log) => (
        <span className="text-xs text-zinc-500">
          {formatDateTime(log.createdAt, locale)}
        </span>
      ),
    },
    {
      key: "user",
      header: tbl.user,
      render: (log) => (
        <span className="text-[13px] text-zinc-800">
          {log.userEmail ?? "–"}
        </span>
      ),
    },
    {
      key: "method",
      header: tbl.action,
      className: "w-24",
      render: (log) => (
        <Badge className={cn(methodStyles[log.method] ?? "border-zinc-200")}>
          {log.method}
        </Badge>
      ),
    },
    {
      key: "resource",
      header: tbl.resource,
      render: (log) => (
        <span className="text-[13px] text-zinc-700">{log.resource}</span>
      ),
    },
    {
      key: "path",
      header: tbl.path,
      className: "hidden md:table-cell",
      render: (log) => (
        <code className="text-[11px] text-zinc-400">{log.path}</code>
      ),
    },
  ];

  return (
    <div>
      <PageHeader page="activity" />
      <div className="relative mb-4 w-64">
        <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <Input
          placeholder={t("common.search")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="ps-8"
        />
      </div>
      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        rowKey={(log) => log._id}
        loading={isLoading}
        emptyText={t("pages.activity.empty")}
        meta={data?.meta}
        onPageChange={setPage}
      />
    </div>
  );
}
