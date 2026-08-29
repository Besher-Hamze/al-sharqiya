"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { api, apiErrorMessage, assetUrl } from "@/lib/api";
import { toast } from "@/lib/stores/toast-store";
import type { Paginated, Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Drawer } from "@/components/ui/drawer";
import { FormField } from "@/components/ui/form-field";
import { GalleryEditor } from "@/components/ui/gallery-editor";
import { ImagePicker } from "@/components/ui/image-picker";
import { Input, Textarea } from "@/components/ui/input";
import { LocalizedListEditor } from "@/components/ui/localized-list-editor";
import { LocalizedSectionEditor } from "@/components/ui/localized-section-editor";
import { LocalizedTabs } from "@/components/ui/localized-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { SpecsEditor } from "@/components/ui/specs-editor";
import { Switch } from "@/components/ui/switch";
import { useFormLabels } from "@/lib/i18n/use-form-labels";
import { useTableLabels } from "@/lib/i18n/use-table-labels";
import { useT } from "@/lib/i18n/use-t";

const localized = z.object({ en: z.string(), ar: z.string() });

const serviceSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  order: z.number().int(),
  icon: z.string(),
  name: z.object({ en: z.string().min(1), ar: z.string() }),
  excerpt: localized,
  description: localized,
  features: z.array(localized),
  specs: z.array(z.object({ label: localized, value: localized })),
  sections: z.array(
    z.object({
      heading: localized,
      body: localized,
      images: z
        .array(
          z.object({
            src: z.string(),
            alt: localized.optional(),
            caption: localized.optional(),
          }),
        )
        .optional(),
    }),
  ),
  coverImage: z.string(),
  gallery: z.array(
    z.object({
      src: z.string(),
      alt: localized.optional(),
      caption: localized.optional(),
    }),
  ),
  isPublished: z.boolean(),
});

type ServiceValues = z.infer<typeof serviceSchema>;

const emptyValues: ServiceValues = {
  slug: "",
  order: 0,
  icon: "",
  name: { en: "", ar: "" },
  excerpt: { en: "", ar: "" },
  description: { en: "", ar: "" },
  features: [],
  specs: [],
  sections: [],
  coverImage: "",
  gallery: [],
  isPublished: false,
};

export default function ServicesPage() {
  const t = useT();
  const tbl = useTableLabels();
  const f = useFormLabels();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["services", "list", search, page],
    queryFn: async () =>
      (
        await api.get<Paginated<Service>>("/services/admin", {
          params: {
            page,
            limit: 20,
            sort: "order",
            ...(search ? { search } : {}),
          },
        })
      ).data,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["services"] });

  const form = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: emptyValues,
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({ ...emptyValues, order: (data?.meta.total ?? 0) + 1 });
    setDrawerOpen(true);
  };

  const openEdit = async (row: Service) => {
    setEditing(row);
    setDrawerOpen(true);
    try {
      const full = (await api.get<Service>(`/services/admin/${row._id}`)).data;
      setEditing(full);
      form.reset({
        slug: full.slug,
        order: full.order,
        icon: full.icon ?? "",
        name: full.name,
        excerpt: full.excerpt ?? { en: "", ar: "" },
        description: full.description ?? { en: "", ar: "" },
        features: full.features ?? [],
        specs: full.specs ?? [],
        sections: full.sections ?? [],
        coverImage: full.coverImage ?? "",
        gallery: full.gallery ?? [],
        isPublished: full.isPublished,
      });
    } catch (err) {
      toast.error(apiErrorMessage(err));
      setDrawerOpen(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (values: ServiceValues) => {
      const payload = {
        ...values,
        gallery: values.gallery.filter((g) => g.src.trim()),
        sections: values.sections
          .filter(
            (s) =>
              s.heading.en.trim() ||
              s.heading.ar.trim() ||
              s.body.en.trim() ||
              s.body.ar.trim(),
          )
          .map((s) => ({
            ...s,
            images: (s.images ?? []).filter((g) => g.src.trim()),
          })),
      };
      if (editing) {
        return (await api.patch<Service>(`/services/${editing._id}`, payload))
          .data;
      }
      return (await api.post<Service>("/services", payload)).data;
    },
    onSuccess: () => {
      invalidate();
      setDrawerOpen(false);
      toast.success(
        editing ? t("toast.serviceUpdated") : t("toast.serviceCreated"),
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
    }) => api.patch(`/services/${id}/publish`, { isPublished }),
    onMutate: async ({ id, isPublished }) => {
      await queryClient.cancelQueries({ queryKey: ["services", "list"] });
      queryClient.setQueriesData<Paginated<Service>>(
        { queryKey: ["services", "list"] },
        (old) =>
          old && {
            ...old,
            data: old.data.map((s) =>
              s._id === id ? { ...s, isPublished } : s,
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
      toast.success(t("toast.serviceDeleted"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const columns: Column<Service>[] = [
    {
      key: "image",
      header: "",
      className: "w-14",
      render: (s) =>
        s.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assetUrl(s.coverImage)}
            alt=""
            className="size-10 rounded-lg border border-zinc-100 object-cover"
          />
        ) : (
          <span className="flex size-10 items-center justify-center rounded-lg bg-zinc-50">
            <ImageIcon className="size-4 text-zinc-300" />
          </span>
        ),
    },
    {
      key: "name",
      header: tbl.name,
      render: (s) => (
        <div>
          <p className="font-medium text-zinc-900">{s.name.en}</p>
          <p className="text-xs text-zinc-400" dir="rtl">
            {s.name.ar}
          </p>
        </div>
      ),
    },
    {
      key: "slug",
      header: tbl.slug,
      className: "hidden md:table-cell",
      render: (s) => (
        <code className="rounded bg-zinc-50 px-1.5 py-0.5 text-xs text-zinc-500">
          {s.slug}
        </code>
      ),
    },
    {
      key: "order",
      header: tbl.order,
      className: "w-24 text-center",
      render: (s) => <span className="text-zinc-500">{s.order}</span>,
    },
    {
      key: "published",
      header: tbl.published,
      className: "w-28",
      render: (s) => (
        <Switch
          checked={s.isPublished}
          onChange={(v) =>
            publishMutation.mutate({ id: s._id, isPublished: v })
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
      render: (s) => (
        <div className="flex justify-end gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(s);
            }}
            className="cursor-pointer rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label={tbl.edit}
          >
            <Pencil className="size-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(s);
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
        page="services"
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            {t("pages.services.create")}
          </Button>
        }
      />

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
        rowKey={(s) => s._id}
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
            ? t("pages.services.edit", { name: editing.name.en })
            : t("pages.services.create")
        }
        widthClass="max-w-3xl"
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
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              label={f.slug}
              error={errors.slug?.message}
              required
              className="sm:col-span-2"
              hint={f.slugHint}
            >
              <Input placeholder={f.slugHint} {...form.register("slug")} />
            </FormField>
            <FormField label={f.order}>
              <Input
                type="number"
                {...form.register("order", { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <FormField label={f.icon}>
            <Input placeholder="layers" {...form.register("icon")} />
          </FormField>

          <LocalizedTabs>
            {(lang) => (
              <div className="space-y-4">
                <FormField
                  label={`${tbl.name} (${lang.toUpperCase()})`}
                  error={lang === "en" ? errors.name?.en?.message : undefined}
                  required={lang === "en"}
                >
                  <Input
                    dir={lang === "ar" ? "rtl" : undefined}
                    {...form.register(`name.${lang}`)}
                  />
                </FormField>
                <FormField label={`${f.excerpt} (${lang.toUpperCase()})`}>
                  <Textarea
                    className="min-h-16"
                    dir={lang === "ar" ? "rtl" : undefined}
                    {...form.register(`excerpt.${lang}`)}
                  />
                </FormField>
                <FormField label={`${f.description} (${lang.toUpperCase()})`}>
                  <Textarea
                    dir={lang === "ar" ? "rtl" : undefined}
                    {...form.register(`description.${lang}`)}
                  />
                </FormField>
              </div>
            )}
          </LocalizedTabs>

          <Controller
            control={form.control}
            name="features"
            render={({ field }) => (
              <LocalizedListEditor
                label={f.features}
                value={field.value}
                onChange={field.onChange}
                addLabel={f.addFeature}
              />
            )}
          />

          <Controller
            control={form.control}
            name="specs"
            render={({ field }) => (
              <SpecsEditor
                label={f.specs}
                value={field.value}
                onChange={field.onChange}
                addLabel={f.addSpec}
              />
            )}
          />

          <Controller
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <ImagePicker
                value={field.value}
                onChange={field.onChange}
                label={f.coverImage}
              />
            )}
          />

          <hr className="border-zinc-100" />

          <Controller
            control={form.control}
            name="sections"
            render={({ field }) => (
              <LocalizedSectionEditor
                label={f.sections}
                hint={f.sectionsHint}
                value={field.value}
                onChange={field.onChange}
                addLabel={f.addSection}
              />
            )}
          />

          <hr className="border-zinc-100" />

          <Controller
            control={form.control}
            name="gallery"
            render={({ field }) => (
              <GalleryEditor
                label={f.gallery}
                value={field.value}
                onChange={field.onChange}
              />
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
        title={t("pages.services.deleteTitle")}
        message={t("pages.services.deleteMessage", {
          name: deleteTarget?.name.en ?? "",
        })}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
