"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import { api, apiErrorMessage } from "@/lib/api";
import { toast } from "@/lib/stores/toast-store";
import type { ContactMessage, Paginated } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Drawer } from "@/components/ui/drawer";
import { PageHeader } from "@/components/ui/page-header";
import { useT } from "@/lib/i18n/use-t";
import { useTableLabels } from "@/lib/i18n/use-table-labels";
import { useDashboardLocale } from "@/lib/i18n/use-t";

type Filter = "all" | "unread";

export default function MessagesPage() {
  const t = useT();
  const tbl = useTableLabels();
  const { locale } = useDashboardLocale();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["contact", "list", page],
    queryFn: async () =>
      (
        await api.get<Paginated<ContactMessage>>("/contact", {
          params: { page, limit: 50 },
        })
      ).data,
  });

  const rows = (data?.data ?? []).filter((m) =>
    filter === "unread" ? !m.isRead : true,
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["contact"] });

  const readMutation = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) =>
      (await api.patch<ContactMessage>(`/contact/${id}`, { isRead })).data,
    onSuccess: (updated) => {
      invalidate();
      setSelected((prev) =>
        prev && prev._id === updated._id ? updated : prev,
      );
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/contact/${id}`),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
      setSelected(null);
      toast.success(t("toast.messageDeleted"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const openMessage = (m: ContactMessage) => {
    setSelected(m);
    if (!m.isRead) readMutation.mutate({ id: m._id, isRead: true });
  };

  const columns: Column<ContactMessage>[] = [
    {
      key: "from",
      header: tbl.sender,
      render: (m) => (
        <div className="flex items-center gap-2">
          {!m.isRead && (
            <span className="size-1.5 shrink-0 rounded-full bg-brand-600" />
          )}
          <div className={cn(!m.isRead && "font-semibold")}>
            <p className="text-zinc-900">{m.name}</p>
            <p className="text-xs font-normal text-zinc-400">{m.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      header: tbl.subject,
      render: (m) => (
        <div className="max-w-md">
          {m.subject && (
            <p
              className={cn(
                "truncate text-zinc-800",
                !m.isRead && "font-medium",
              )}
            >
              {m.subject}
            </p>
          )}
          <p className="truncate text-xs text-zinc-400">{m.message}</p>
        </div>
      ),
    },
    {
      key: "date",
      header: tbl.received,
      className: "hidden md:table-cell",
      render: (m) => (
        <span className="text-xs text-zinc-400">
          {formatDateTime(m.createdAt, locale)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-end",
      render: (m) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDeleteTarget(m);
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
      <PageHeader page="messages" />

      <div className="mb-4 inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
        {(
          [
            { value: "all", label: t("common.all") },
            { value: "unread", label: t("common.unread") },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setFilter(tab.value);
              setPage(1);
            }}
            className={cn(
              "cursor-pointer rounded-md px-3.5 py-1 text-xs font-medium transition",
              filter === tab.value
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(m) => m._id}
        loading={isLoading}
        onRowClick={openMessage}
        rowClassName={(m) => (!m.isRead ? "bg-brand-50/30" : undefined)}
        meta={data?.meta}
        onPageChange={setPage}
      />

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={t("pages.messages.detail")}
        widthClass="max-w-md"
        footer={
          selected && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  readMutation.mutate({
                    id: selected._id,
                    isRead: !selected.isRead,
                  })
                }
              >
                {selected.isRead
                  ? t("common.markAsUnread")
                  : t("common.markAsRead")}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteTarget(selected)}
              >
                <Trash2 className="size-3.5" />
                {tbl.delete}
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
              <a
                href={`mailto:${selected.email}`}
                className="flex items-center gap-2 text-[13px] text-brand-600 hover:underline"
              >
                <Mail className="size-3.5" />
                {selected.email}
              </a>
              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  className="flex items-center gap-2 text-[13px] text-brand-600 hover:underline"
                >
                  <Phone className="size-3.5" />
                  {selected.phone}
                </a>
              )}
            </div>
            {selected.subject && (
              <div>
                <p className="mb-1 text-xs font-medium text-zinc-500">
                  {t("common.subject")}
                </p>
                <p className="text-[13px] font-medium text-zinc-800">
                  {selected.subject}
                </p>
              </div>
            )}
            <div>
              <p className="mb-1 text-xs font-medium text-zinc-500">
                {t("common.message")}
              </p>
              <p className="whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-[13px] leading-relaxed text-zinc-700">
                {selected.message}
              </p>
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
        title={t("pages.messages.deleteTitle")}
        message={t("pages.messages.deleteMessage", {
          name: deleteTarget?.name ?? "",
        })}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
