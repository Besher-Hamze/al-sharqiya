"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { api, apiErrorMessage } from "@/lib/api";
import { toast } from "@/lib/stores/toast-store";
import type { Faq, Paginated } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Drawer } from "@/components/ui/drawer";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { LocalizedTabs } from "@/components/ui/localized-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { useFormLabels } from "@/lib/i18n/use-form-labels";
import { useTableLabels } from "@/lib/i18n/use-table-labels";
import { useT } from "@/lib/i18n/use-t";

const faqSchema = z.object({
  question: z.object({ en: z.string().min(1), ar: z.string() }),
  answer: z.object({ en: z.string().min(1), ar: z.string() }),
  order: z.number().int(),
  isPublished: z.boolean(),
});

type FaqValues = z.infer<typeof faqSchema>;

export default function FaqPage() {
  const t = useT();
  const tbl = useTableLabels();
  const f = useFormLabels();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["faqs", "list", page],
    queryFn: async () =>
      (
        await api.get<Paginated<Faq>>("/faqs/admin", {
          params: { page, limit: 50, sort: "order" },
        })
      ).data,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["faqs"] });

  const form = useForm<FaqValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: { en: "", ar: "" },
      answer: { en: "", ar: "" },
      order: 0,
      isPublished: true,
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({
      question: { en: "", ar: "" },
      answer: { en: "", ar: "" },
      order: (data?.meta.total ?? 0) + 1,
      isPublished: true,
    });
    setDrawerOpen(true);
  };

  const openEdit = (row: Faq) => {
    setEditing(row);
    form.reset({
      question: row.question,
      answer: row.answer,
      order: row.order,
      isPublished: row.isPublished,
    });
    setDrawerOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: FaqValues) => {
      if (editing) return api.patch(`/faqs/${editing._id}`, values);
      return api.post("/faqs", values);
    },
    onSuccess: () => {
      invalidate();
      setDrawerOpen(false);
      toast.success(editing ? t("toast.faqUpdated") : t("toast.faqCreated"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const publishMutation = useMutation({
    mutationFn: async ({
      id,
      isPublished,
    }: {
      id: string;
      isPublished: boolean;
    }) => api.patch(`/faqs/${id}/publish`, { isPublished }),
    onMutate: async ({ id, isPublished }) => {
      await queryClient.cancelQueries({ queryKey: ["faqs", "list"] });
      queryClient.setQueriesData<Paginated<Faq>>(
        { queryKey: ["faqs", "list"] },
        (old) =>
          old && {
            ...old,
            data: old.data.map((item) =>
              item._id === id ? { ...item, isPublished } : item,
            ),
          },
      );
    },
    onError: (err) => {
      toast.error(apiErrorMessage(err));
      invalidate();
    },
    onSettled: () => invalidate(),
  });

  const reorderMutation = useMutation({
    mutationFn: async (items: { id: string; order: number }[]) =>
      api.patch("/faqs/reorder", { items }),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/faqs/${id}`),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
      toast.success(t("toast.faqDeleted"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const rows = data?.data ?? [];

  const move = (faq: Faq, dir: -1 | 1) => {
    const index = rows.findIndex((r) => r._id === faq._id);
    const target = index + dir;
    if (index < 0 || target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    reorderMutation.mutate(next.map((item, i) => ({ id: item._id, order: i + 1 })));
  };

  const columns: Column<Faq>[] = [
    {
      key: "order",
      header: "",
      className: "w-16",
      render: (row) => {
        const index = rows.findIndex((r) => r._id === row._id);
        return (
          <div className="flex flex-col">
            <button
              onClick={(e) => {
                e.stopPropagation();
                move(row, -1);
              }}
              disabled={index === 0}
              className="cursor-pointer rounded p-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
              aria-label={t("aria.moveUp")}
            >
              <ArrowUp className="size-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                move(row, 1);
              }}
              disabled={index === rows.length - 1}
              className="cursor-pointer rounded p-0.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
              aria-label={t("aria.moveDown")}
            >
              <ArrowDown className="size-3.5" />
            </button>
          </div>
        );
      },
    },
    {
      key: "question",
      header: tbl.question,
      render: (row) => (
        <div>
          <p className="font-medium text-zinc-900">{row.question.en}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-400">
            {row.answer.en}
          </p>
        </div>
      ),
    },
    {
      key: "published",
      header: tbl.published,
      className: "w-28",
      render: (row) => (
        <Switch
          checked={row.isPublished}
          onChange={(v) =>
            publishMutation.mutate({ id: row._id, isPublished: v })
          }
          label={tbl.published}
          size="sm"
        />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20 text-end",
      render: (row) => (
        <div className="flex justify-end gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row);
            }}
            className="cursor-pointer rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label={tbl.edit}
          >
            <Pencil className="size-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(row);
            }}
            className="cursor-pointer rounded-md p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label={tbl.delete}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  const errors = form.formState.errors;

  return (
    <div>
      <PageHeader
        page="faq"
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            {t("pages.faq.create")}
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row._id}
        loading={isLoading}
        onRowClick={openEdit}
        meta={data?.meta}
        onPageChange={setPage}
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? t("pages.faq.edit") : t("pages.faq.create")}
        widthClass="max-w-xl"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDrawerOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              size="sm"
              loading={saveMutation.isPending}
              onClick={form.handleSubmit((v) => saveMutation.mutate(v))}
            >
              {t("common.save")}
            </Button>
          </>
        }
      >
        <form className="space-y-5" noValidate>
          <LocalizedTabs>
            {(lang) => (
              <div className="space-y-4">
                <FormField
                  label={`${f.question} (${lang.toUpperCase()})`}
                  error={lang === "en" ? errors.question?.en?.message : undefined}
                  required={lang === "en"}
                >
                  <Input
                    dir={lang === "ar" ? "rtl" : undefined}
                    {...form.register(`question.${lang}`)}
                  />
                </FormField>
                <FormField
                  label={`${f.answer} (${lang.toUpperCase()})`}
                  error={lang === "en" ? errors.answer?.en?.message : undefined}
                  required={lang === "en"}
                >
                  <Textarea
                    dir={lang === "ar" ? "rtl" : undefined}
                    {...form.register(`answer.${lang}`)}
                  />
                </FormField>
              </div>
            )}
          </LocalizedTabs>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={f.order}>
              <Input
                type="number"
                {...form.register("order", { valueAsNumber: true })}
              />
            </FormField>
            <div className="flex items-end pb-1.5">
              <Controller
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <label className="flex items-center gap-2.5 text-sm text-zinc-700">
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      label={f.published}
                    />
                    {f.published}
                  </label>
                )}
              />
            </div>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate(deleteTarget._id)
        }
        title={t("pages.faq.deleteTitle")}
        message={t("pages.faq.deleteMessage", {
          name: deleteTarget?.question.en ?? "",
        })}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
