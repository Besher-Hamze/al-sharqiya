"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  FolderOpen,
  Hammer,
  Inbox,
  LayoutGrid,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/api";
import type {
  ContactMessage,
  Paginated,
  QuoteRequest,
  StatsOverview,
} from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { QuoteStatusBadge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { useT } from "@/lib/i18n/use-t";
import { useTableLabels } from "@/lib/i18n/use-table-labels";
import { useDashboardLocale } from "@/lib/i18n/use-t";

function StatCard({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        <span
          className={`flex size-7 items-center justify-center rounded-lg ${tint}`}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
        {value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const t = useT();
  const tbl = useTableLabels();
  const { locale } = useDashboardLocale();

  const { data: stats } = useQuery({
    queryKey: ["stats", "overview"],
    queryFn: async () =>
      (await api.get<StatsOverview>("/stats/overview")).data,
  });

  const { data: messages } = useQuery({
    queryKey: ["contact", "recent"],
    queryFn: async () =>
      (
        await api.get<Paginated<ContactMessage>>("/contact", {
          params: { limit: 5 },
        })
      ).data,
  });

  const quoteColumns: Column<QuoteRequest>[] = [
    {
      key: "name",
      header: tbl.name,
      render: (q) => (
        <div>
          <p className="font-medium text-zinc-900">{q.name}</p>
          <p className="text-xs text-zinc-400">{q.phone}</p>
        </div>
      ),
    },
    {
      key: "service",
      header: tbl.service,
      render: (q) => (
        <span className="text-xs text-zinc-600">
          {(q.services ?? []).join(", ") || "–"}
        </span>
      ),
    },
    {
      key: "status",
      header: tbl.status,
      render: (q) => <QuoteStatusBadge status={q.status} />,
    },
    {
      key: "date",
      header: tbl.date,
      render: (q) => (
        <span className="text-xs text-zinc-400">
          {formatDateTime(q.createdAt, locale)}
        </span>
      ),
    },
  ];

  const chartData = (stats?.quoteTrend ?? []).map((d) => ({
    day: d.date.slice(5),
    count: d.count,
  }));

  return (
    <div>
      <PageHeader page="overview" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label={t("pages.overview.stats.quotesNew")}
          value={stats?.quotes.new ?? "–"}
          icon={Briefcase}
          tint="bg-amber-50 text-amber-600"
        />
        <StatCard
          label={t("pages.overview.stats.quotesTotal")}
          value={stats?.quotes.total ?? "–"}
          icon={LayoutGrid}
          tint="bg-sky-50 text-sky-600"
        />
        <StatCard
          label={t("pages.overview.stats.unread")}
          value={stats?.messages.unread ?? "–"}
          icon={Inbox}
          tint="bg-brand-50 text-brand-600"
        />
        <StatCard
          label={t("pages.overview.stats.services")}
          value={stats?.counts.servicesPublished ?? "–"}
          icon={Hammer}
          tint="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label={t("pages.overview.stats.projects")}
          value={stats?.counts.projectsPublished ?? "–"}
          icon={MessageSquare}
          tint="bg-violet-50 text-violet-600"
        />
        <StatCard
          label={t("pages.overview.stats.media")}
          value={stats?.counts.media ?? "–"}
          icon={FolderOpen}
          tint="bg-zinc-100 text-zinc-600"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              {t("pages.overview.recentQuotes")}
            </h2>
            <Link
              href="/quotes"
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              {t("common.viewAll")}
            </Link>
          </div>
          <DataTable
            columns={quoteColumns}
            rows={stats?.recentQuotes ?? []}
            rowKey={(q) => q._id}
            emptyText={t("pages.overview.noQuotes")}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900">
              {t("pages.overview.quoteTrend")}
            </h2>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f4f4f5"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    axisLine={false}
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#a1a1aa" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#fafafa" }}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e4e4e7",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#c1913a"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Inbox className="size-4 text-brand-600" />
              <h2 className="text-sm font-semibold text-zinc-900">
                {t("pages.overview.recentMessages")}
              </h2>
              <Link
                href="/messages"
                className="ms-auto text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                {t("common.viewAllShort")}
              </Link>
            </div>
            {!messages || messages.data.length === 0 ? (
              <p className="py-4 text-center text-xs text-zinc-400">
                {t("pages.overview.noMessages")}
              </p>
            ) : (
              <ul className="divide-y divide-zinc-50">
                {messages.data.map((m) => (
                  <li key={m._id} className="flex items-start gap-2.5 py-2.5">
                    {!m.isRead && (
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-600" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-zinc-800">
                        {m.name}
                        {m.subject ? ` · ${m.subject}` : ""}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {m.message}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-zinc-400">
                      {formatDateTime(m.createdAt, locale)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
