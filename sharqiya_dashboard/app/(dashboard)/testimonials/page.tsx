"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { api, apiErrorMessage } from "@/lib/api";
import { toast } from "@/lib/stores/toast-store";
import type { Paginated, Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Drawer } from "@/components/ui/drawer";
import { FormField } from "@/components/ui/form-field";
import { ImagePicker } from "@/components/ui/image-picker";
import { Input, Textarea } from "@/components/ui/input";
import { LocalizedTabs } from "@/components/ui/localized-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { useFormLabels } from "@/lib/i18n/use-form-labels";
import { useTableLabels } from "@/lib/i18n/use-table-labels";
import { useT } from "@/lib/i18n/use-t";

const localized = z.object({ en: z.string(), ar: z.string() });

const testimonialSchema = z.object({
  author: z.object({ en: z.string().min(1), ar: z.string() }),
  role: localized,
  quote: z.object({ en: z.string().min(1), ar: z.string() }),
  rating: z.number().int().min(1).max(5),
  avatar: z.string(),
  order: z.number().int(),
  isPublished: z.boolean(),
});

type TestimonialValues = z.infer<typeof testimonialSchema>;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-200",
          )}
        />
      ))}
    </span>
  );
}

export default function TestimonialsPage() {
  const t = useT();
  const tbl = useTableLabels();
  const f = useFormLabels();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["testimonials", "list", page],
    queryFn: async () =>
      (
        await api.get<Paginated<Testimonial>>("/testimonials/admin", {
          params: { page, limit: 20, sort: "order" },
        })
      ).data,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["testimonials"] });

  const form = useForm<TestimonialValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      author: { en: "", ar: "" },
      role: { en: "", ar: "" },
      quote: { en: "", ar: "" },
      rating: 5,
      avatar: "",
      order: 0,
      isPublished: true,
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({
      author: { en: "", ar: "" },
      role: { en: "", ar: "" },
      quote: { en: "", ar: "" },
      rating: 5,
      avatar: "",
      order: (data?.meta.total ?? 0) + 1,
      isPublished: true,
    });
    setDrawerOpen(true);
  };

  const openEdit = (row: Testimonial) => {
    setEditing(row);
    form.reset({
      author: row.author,
      role: row.role ?? { en: "", ar: "" },
      quote: row.quote,
      rating: row.rating ?? 5,
      avatar: row.avatar ?? "",
      order: row.order,
      isPublished: row.isPublished,
    });
    setDrawerOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: TestimonialValues) => {
      if (editing) return api.patch(`/testimonials/${editing._id}`, values);
      return api.post("/testimonials", values);
    },
    onSuccess: () => {
      invalidate();
      setDrawerOpen(false);
      toast.success(
        editing
          ? t("toast.testimonialUpdated")
          : t("toast.testimonialCreated"),
      );
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
    }) => api.patch(`/testimonials/${id}/publish`, { isPublished }),
    onError: (err) => {
      toast.error(apiErrorMessage(err));
      invalidate();
    },
    onSettled: () => invalidate(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/testimonials/${id}`),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
      toast.success(t("toast.testimonialDeleted"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const columns: Column<Testimonial>[] = [
    {
      key: "author",
      header: tbl.name,
      render: (row) => (
        <div>
          <p className="font-medium text-zinc-900">{row.author.en}</p>
          <p className="text-xs text-zinc-400">{row.role?.en}</p>
        </div>
      ),
    },
    {
      key: "quote",
      header: t("forms.quote"),
      render: (row) => (
        <p className="max-w-md line-clamp-2 text-sm text-zinc-600">
          {row.quote.en}
        </p>
      ),
    },
    {
      key: "rating",
      header: tbl.rating,
      className: "w-28",
      render: (row) => <Stars rating={row.rating ?? 0} />,
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
            className="cursor-pointer rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            aria-label={tbl.edit}
          >
            <Pencil className="size-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(row);
            }}
            className="cursor-pointer rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
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
        page="testimonials"
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            {t("pages.testimonials.create")}
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        rowKey={(row) => row._id}
        loading={isLoading}
        onRowClick={openEdit}
        meta={data?.meta}
        onPageChange={setPage}
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          editing
            ? t("pages.testimonials.edit")
            : t("pages.testimonials.create")
        }
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
                  label={`${f.author} (${lang.toUpperCase()})`}
                  error={lang === "en" ? errors.author?.en?.message : undefined}
                  required={lang === "en"}
                >
                  <Input
                    dir={lang === "ar" ? "rtl" : undefined}
                    {...form.register(`author.${lang}`)}
                  />
                </FormField>
                <FormField label={`${f.role} (${lang.toUpperCase()})`}>
                  <Input
                    dir={lang === "ar" ? "rtl" : undefined}
                    {...form.register(`role.${lang}`)}
                  />
                </FormField>
                <FormField
                  label={`${f.quote} (${lang.toUpperCase()})`}
                  error={lang === "en" ? errors.quote?.en?.message : undefined}
                  required={lang === "en"}
                >
                  <Textarea
                    dir={lang === "ar" ? "rtl" : undefined}
                    {...form.register(`quote.${lang}`)}
                  />
                </FormField>
              </div>
            )}
          </LocalizedTabs>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={f.rating}>
              <Input
                type="number"
                min={1}
                max={5}
                {...form.register("rating", { valueAsNumber: true })}
              />
            </FormField>
            <FormField label={f.order}>
              <Input
                type="number"
                {...form.register("order", { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <Controller
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <ImagePicker value={field.value} onChange={field.onChange} />
            )}
          />

          <Controller
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <div className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50/50 px-3 py-2.5">
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  label={f.published}
                />
                <span className="text-sm text-zinc-700">{f.publishHint}</span>
              </div>
            )}
          />
        </form>
      </Drawer>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate(deleteTarget._id)
        }
        title={t("pages.testimonials.deleteTitle")}
        message={t("pages.testimonials.deleteMessage", {
          name: deleteTarget?.author.en ?? "",
        })}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
