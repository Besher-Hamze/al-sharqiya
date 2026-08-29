"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { api, apiErrorMessage, assetUrl } from "@/lib/api";
import { toast } from "@/lib/stores/toast-store";
import type { Paginated, Project, Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Drawer } from "@/components/ui/drawer";
import { FormField } from "@/components/ui/form-field";
import { GalleryEditor } from "@/components/ui/gallery-editor";
import { ImagePicker } from "@/components/ui/image-picker";
import { Input, Select, Textarea } from "@/components/ui/input";
import { LocalizedListEditor } from "@/components/ui/localized-list-editor";
import { LocalizedTabs } from "@/components/ui/localized-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { useFormLabels } from "@/lib/i18n/use-form-labels";
import { useTableLabels } from "@/lib/i18n/use-table-labels";
import { useT } from "@/lib/i18n/use-t";

const localized = z.object({ en: z.string(), ar: z.string() });

const projectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  order: z.number().int(),
  serviceSlug: z.string().min(1),
  isFeatured: z.boolean(),
  title: z.object({ en: z.string().min(1), ar: z.string() }),
  client: localized,
  location: localized,
  area: z.string(),
  year: z.number().int().nullable(),
  excerpt: localized,
  description: localized,
  scope: z.array(localized),
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

type ProjectValues = z.infer<typeof projectSchema>;

const emptyValues: ProjectValues = {
  slug: "",
  order: 0,
  serviceSlug: "",
  isFeatured: false,
  title: { en: "", ar: "" },
  client: { en: "", ar: "" },
  location: { en: "", ar: "" },
  area: "",
  year: null,
  excerpt: { en: "", ar: "" },
  description: { en: "", ar: "" },
  scope: [],
  coverImage: "",
  gallery: [],
  isPublished: false,
};

export default function ProjectsPage() {
  const t = useT();
  const tbl = useTableLabels();
  const f = useFormLabels();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["projects", "list", search, page],
    queryFn: async () =>
      (
        await api.get<Paginated<Project>>("/projects/admin", {
          params: {
            page,
            limit: 20,
            sort: "order",
            ...(search ? { search } : {}),
          },
        })
      ).data,
  });

  const { data: services } = useQuery({
    queryKey: ["services", "picker"],
    queryFn: async () =>
      (
        await api.get<Paginated<Service>>("/services/admin", {
          params: { limit: 100, sort: "order" },
        })
      ).data.data,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["projects"] });

  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: emptyValues,
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({
      ...emptyValues,
      order: (data?.meta.total ?? 0) + 1,
      serviceSlug: services?.[0]?.slug ?? "",
    });
    setDrawerOpen(true);
  };

  const openEdit = async (row: Project) => {
    setEditing(row);
    setDrawerOpen(true);
    try {
      const full = (await api.get<Project>(`/projects/admin/${row._id}`)).data;
      setEditing(full);
      form.reset({
        slug: full.slug,
        order: full.order,
        serviceSlug: full.serviceSlug,
        isFeatured: full.isFeatured,
        title: full.title,
        client: full.client ?? { en: "", ar: "" },
        location: full.location ?? { en: "", ar: "" },
        area: full.area ?? "",
        year: full.year ?? null,
        excerpt: full.excerpt ?? { en: "", ar: "" },
        description: full.description ?? { en: "", ar: "" },
        scope: full.scope ?? [],
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
    mutationFn: async (values: ProjectValues) => {
      const payload = {
        ...values,
        year: values.year || undefined,
        gallery: values.gallery.filter((g) => g.src.trim()),
      };
      if (editing) {
        return (await api.patch<Project>(`/projects/${editing._id}`, payload))
          .data;
      }
      return (await api.post<Project>("/projects", payload)).data;
    },
    onSuccess: () => {
      invalidate();
      setDrawerOpen(false);
      toast.success(
        editing ? t("toast.projectUpdated") : t("toast.projectCreated"),
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
    }) => api.patch(`/projects/${id}/publish`, { isPublished }),
    onMutate: async ({ id, isPublished }) => {
      await queryClient.cancelQueries({ queryKey: ["projects", "list"] });
      queryClient.setQueriesData<Paginated<Project>>(
        { queryKey: ["projects", "list"] },
        (old) =>
          old && {
            ...old,
            data: old.data.map((p) =>
              p._id === id ? { ...p, isPublished } : p,
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
    mutationFn: async (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
      toast.success(t("toast.projectDeleted"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const columns: Column<Project>[] = [
    {
      key: "image",
      header: "",
      className: "w-14",
      render: (p) =>
        p.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assetUrl(p.coverImage)}
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
      key: "title",
      header: tbl.title,
      render: (p) => (
        <div>
          <p className="font-medium text-zinc-900">{p.title.en}</p>
          <p className="text-xs text-zinc-400">{p.client?.en}</p>
        </div>
      ),
    },
    {
      key: "service",
      header: tbl.service,
      className: "hidden md:table-cell",
      render: (p) => (
        <code className="rounded bg-zinc-50 px-1.5 py-0.5 text-xs text-zinc-500">
          {p.serviceSlug}
        </code>
      ),
    },
    {
      key: "featured",
      header: tbl.featured,
      className: "w-20 text-center hidden md:table-cell",
      render: (p) =>
        p.isFeatured ? (
          <span className="text-xs font-medium text-brand-700">★</span>
        ) : (
          <span className="text-zinc-300">–</span>
        ),
    },
    {
      key: "published",
      header: tbl.published,
      className: "w-28",
      render: (p) => (
        <Switch
          checked={p.isPublished}
          onChange={(v) =>
            publishMutation.mutate({ id: p._id, isPublished: v })
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
      render: (p) => (
        <div className="flex justify-end gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(p);
            }}
            className="cursor-pointer rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label={tbl.edit}
          >
            <Pencil className="size-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(p);
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
        page="projects"
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            {t("pages.projects.create")}
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
        rowKey={(p) => p._id}
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
            ? t("pages.projects.edit", { name: editing.title.en })
            : t("pages.projects.create")
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
            >
              <Input {...form.register("slug")} />
            </FormField>
            <FormField label={f.order}>
              <Input
                type="number"
                {...form.register("order", { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label={f.serviceSlug}
              error={errors.serviceSlug?.message}
              required
            >
              <Select {...form.register("serviceSlug")}>
                <option value="">–</option>
                {(services ?? []).map((s) => (
                  <option key={s._id} value={s.slug}>
                    {s.name.en}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label={f.year}>
              <Input
                type="number"
                {...form.register("year", {
                  setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
                })}
              />
            </FormField>
          </div>

          <FormField label={f.area}>
            <Input placeholder="10,000 m²" {...form.register("area")} />
          </FormField>

          <LocalizedTabs>
            {(lang) => (
              <div className="space-y-4">
                <FormField
                  label={`${tbl.title} (${lang.toUpperCase()})`}
                  error={lang === "en" ? errors.title?.en?.message : undefined}
                  required={lang === "en"}
                >
                  <Input
                    dir={lang === "ar" ? "rtl" : undefined}
                    {...form.register(`title.${lang}`)}
                  />
                </FormField>
                <FormField label={`${f.client} (${lang.toUpperCase()})`}>
                  <Input
                    dir={lang === "ar" ? "rtl" : undefined}
                    {...form.register(`client.${lang}`)}
                  />
                </FormField>
                <FormField label={`${f.location} (${lang.toUpperCase()})`}>
                  <Input
                    dir={lang === "ar" ? "rtl" : undefined}
                    {...form.register(`location.${lang}`)}
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
            name="scope"
            render={({ field }) => (
              <LocalizedListEditor
                label={f.scope}
                value={field.value}
                onChange={field.onChange}
                addLabel={f.addScope}
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
            name="isFeatured"
            render={({ field }) => (
              <div className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50/50 px-3 py-2.5">
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  label={f.featured}
                />
                <span className="text-sm text-zinc-700">{f.featured}</span>
              </div>
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
        title={t("pages.projects.deleteTitle")}
        message={t("pages.projects.deleteMessage", {
          name: deleteTarget?.title.en ?? "",
        })}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
