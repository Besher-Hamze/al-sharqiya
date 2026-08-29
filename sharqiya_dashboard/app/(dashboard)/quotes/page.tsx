"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import { api, apiErrorMessage } from "@/lib/api";
import { toast } from "@/lib/stores/toast-store";
import {
  QUOTE_STATUSES,
  type Paginated,
  type QuoteRequest,
  type QuoteStatus,
} from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";
import { Badge, QuoteStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Drawer } from "@/components/ui/drawer";
import { PageHeader } from "@/components/ui/page-header";
import { Select, Textarea } from "@/components/ui/input";
import { useT } from "@/lib/i18n/use-t";
import { useTableLabels } from "@/lib/i18n/use-table-labels";
import { useDashboardLocale } from "@/lib/i18n/use-t";
import { useFormLabels } from "@/lib/i18n/use-form-labels";

export default function QuotesPage() {
  const t = useT();
  const tbl = useTableLabels();
  const f = useFormLabels();
  const { locale } = useDashboardLocale();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<QuoteStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<QuoteRequest | null>(null);
  const [note, setNote] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<QuoteRequest | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["quotes", "list", status, page],
    queryFn: async () =>
      (
        await api.get<Paginated<QuoteRequest>>("/quotes", {
          params: {
            page,
            limit: 20,
            ...(status !== "all" ? { status } : {}),
          },
        })
      ).data,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["quotes"] });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      status?: QuoteStatus;
      adminNote?: string;
    }) =>
      (
        await api.patch<QuoteRequest>(`/quotes/${payload.id}`, {
          status: payload.status,
          adminNote: payload.adminNote,
        })
      ).data,
    onSuccess: (updated) => {
      invalidate();
      setSelected(updated);
      toast.success(t("toast.quoteUpdated"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/quotes/${id}`),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
      setSelected(null);
      toast.success(t("toast.quoteDeleted"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const open = (q: QuoteRequest) => {
    setSelected(q);
    setNote(q.adminNote ?? "");
  };

  const columns: Column<QuoteRequest>[] = [
    {
      key: "name",
      header: tbl.name,
      render: (q) => (
        <div>
          <p className="font-medium text-zinc-900">{q.name}</p>
          <p className="text-xs text-zinc-400">{q.company || q.phone}</p>
        </div>
      ),
    },
    {
      key: "service",
      header: tbl.service,
      className: "hidden md:table-cell",
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
      header: tbl.received,
      className: "hidden md:table-cell",
      render: (q) => (
        <span className="text-xs text-zinc-400">
          {formatDateTime(q.createdAt, locale)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-end",
      render: (q) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDeleteTarget(q);
          }}
          className="cursor-pointer rounded-md p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
          aria-label={tbl.delete}
        >
          <Trash2 className="size-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader page="quotes" />

      <div className="mb-4 inline-flex flex-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
        {(["all", ...QUOTE_STATUSES] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setStatus(tab);
              setPage(1);
            }}
            className={cn(
              "cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition",
              status === tab
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            {tab === "all" ? t("common.all") : t(`quoteStatus.${tab}`)}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        rowKey={(q) => q._id}
        loading={isLoading}
        onRowClick={open}
        meta={data?.meta}
        onPageChange={setPage}
      />

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={t("pages.quotes.details")}
        widthClass="max-w-md"
        footer={
          selected && (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteTarget(selected)}
              >
                <Trash2 className="size-3.5" />
                {tbl.delete}
              </Button>
              <Button
                size="sm"
                loading={updateMutation.isPending}
                onClick={() =>
                  selected &&
                  updateMutation.mutate({
                    id: selected._id,
                    status: selected.status,
                    adminNote: note,
                  })
                }
              >
                {t("common.saveNote")}
              </Button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-zinc-900">
                  {selected.name}
                </p>
                <Badge className="border-zinc-200 bg-zinc-50 text-zinc-500">
                  {selected.locale?.toUpperCase()}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-zinc-400">
                {formatDateTime(selected.createdAt, locale)}
              </p>
            </div>

            <div className="space-y-1.5">
              {selected.email && (
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 text-[13px] text-brand-600 hover:underline"
                >
                  <Mail className="size-3.5" />
                  {selected.email}
                </a>
              )}
              <a
                href={`tel:${selected.phone}`}
                className="flex items-center gap-2 text-[13px] text-brand-600 hover:underline"
              >
                <Phone className="size-3.5" />
                {selected.phone}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="text-xs text-zinc-500">{tbl.company}</p>
                <p className="text-zinc-800">{selected.company || "–"}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">{tbl.location}</p>
                <p className="text-zinc-800">
                  {[selected.emirate, selected.area].filter(Boolean).join(" · ") ||
                    "–"}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">{tbl.service}</p>
                <p className="text-zinc-800">
                  {(selected.services ?? []).join(", ") || "–"}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">
                  {t(`propertyType.${selected.propertyType}`)}
                </p>
              </div>
            </div>

            {selected.message && (
              <div>
                <p className="mb-1 text-xs font-medium text-zinc-500">
                  {t("common.message")}
                </p>
                <p className="whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-[13px] leading-relaxed text-zinc-700">
                  {selected.message}
                </p>
              </div>
            )}

            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-500">
                {tbl.status}
              </p>
              <Select
                value={selected.status}
                onChange={(e) =>
                  setSelected({
                    ...selected,
                    status: e.target.value as QuoteStatus,
                  })
                }
              >
                {QUOTE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(`quoteStatus.${s}`)}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-500">
                {f.internalNote}
              </p>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("pages.quotes.notePlaceholder")}
              />
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate(deleteTarget._id)
        }
        title={t("pages.quotes.deleteTitle")}
        message={t("pages.quotes.deleteMessage", {
          name: deleteTarget?.name ?? "",
        })}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
