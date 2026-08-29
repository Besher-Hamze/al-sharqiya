"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Images,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { api, apiErrorMessage, assetUrl } from "@/lib/api";
import { useSyncedDraft } from "@/lib/use-synced-draft";
import { toast } from "@/lib/stores/toast-store";
import type { ContentImage, GalleryAlbum, Localized, Paginated } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { LocalizedTabs } from "@/components/ui/localized-tabs";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { useT } from "@/lib/i18n/use-t";
import { useFormLabels } from "@/lib/i18n/use-form-labels";
import { MediaLibraryModal } from "@/components/media/media-library-modal";

interface Draft {
  title: Localized;
  description: Localized;
  coverImage: string;
  images: ContentImage[];
  isPublished: boolean;
}

export default function GalleryPage() {
  const t = useT();
  const f = useFormLabels();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [deleteAlbum, setDeleteAlbum] = useState<GalleryAlbum | null>(null);

  const { data: albums, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () =>
      (
        await api.get<Paginated<GalleryAlbum>>("/gallery/admin", {
          params: { limit: 50, sort: "order" },
        })
      ).data.data,
  });

  const selected =
    albums?.find((a) => a._id === selectedId) ?? albums?.[0];

  const [draft, setDraft] = useSyncedDraft<Draft>(selected?._id, () =>
    selected
      ? structuredClone({
          title: selected.title,
          description: selected.description ?? { en: "", ar: "" },
          coverImage: selected.coverImage ?? "",
          images: selected.images ?? [],
          isPublished: selected.isPublished,
        })
      : null,
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["gallery"] });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selected || !draft) return;
      return api.patch(`/gallery/${selected._id}`, {
        title: draft.title,
        description: draft.description,
        coverImage: draft.coverImage,
        images: draft.images.map((img, i) => ({ ...img, order: i + 1 })),
        isPublished: draft.isPublished,
      });
    },
    onSuccess: () => {
      invalidate();
      toast.success(t("toast.gallerySaved"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const createMutation = useMutation({
    mutationFn: async () =>
      (
        await api.post<GalleryAlbum>("/gallery", {
          slug: newSlug,
          title: { en: newTitle, ar: "" },
          images: [],
          isPublished: true,
        })
      ).data,
    onSuccess: (created) => {
      invalidate();
      setCreateOpen(false);
      setSelectedId(created._id);
      setNewSlug("");
      setNewTitle("");
      toast.success(t("toast.galleryCreated"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/gallery/${id}`),
    onSuccess: () => {
      invalidate();
      setDeleteAlbum(null);
      setSelectedId(null);
      toast.success(t("toast.galleryDeleted"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const moveImage = (index: number, dir: -1 | 1) => {
    if (!draft) return;
    const target = index + dir;
    if (target < 0 || target >= draft.images.length) return;
    const next = [...draft.images];
    [next[index], next[target]] = [next[target], next[index]];
    setDraft({ ...draft, images: next });
  };

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <LoaderCircle className="size-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        page="gallery"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            {t("pages.gallery.create")}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="space-y-1">
          {(albums ?? []).map((album) => (
            <button
              key={album._id}
              onClick={() => setSelectedId(album._id)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-start text-[13px] transition",
                selected?._id === album._id
                  ? "bg-brand-50 text-brand-700"
                  : "text-zinc-600 hover:bg-zinc-50",
              )}
            >
              <Images className="size-3.5 shrink-0" />
              <span className="truncate">{album.title.en}</span>
            </button>
          ))}
        </div>

        {!selected || !draft ? (
          <p className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-400">
            {t("pages.gallery.noAlbumSelected")}
          </p>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-zinc-900">
                {t("pages.gallery.edit")}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteAlbum(selected)}
                >
                  <Trash2 className="size-3.5" />
                  {t("pages.gallery.deleteAlbum")}
                </Button>
                <Button
                  size="sm"
                  loading={saveMutation.isPending}
                  onClick={() => saveMutation.mutate()}
                >
                  <Save className="size-3.5" />
                  {t("common.save")}
                </Button>
              </div>
            </div>

            <LocalizedTabs>
              {(lang) => (
                <div className="space-y-3">
                  <FormField
                    label={`${t("pages.gallery.albumTitle")} (${lang.toUpperCase()})`}
                  >
                    <Input
                      dir={lang === "ar" ? "rtl" : undefined}
                      value={draft.title[lang]}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          title: { ...draft.title, [lang]: e.target.value },
                        })
                      }
                    />
                  </FormField>
                  <FormField label={`${f.description} (${lang.toUpperCase()})`}>
                    <Input
                      dir={lang === "ar" ? "rtl" : undefined}
                      value={draft.description[lang]}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          description: {
                            ...draft.description,
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                  </FormField>
                </div>
              )}
            </LocalizedTabs>

            <label className="flex items-center gap-2.5 text-sm text-zinc-700">
              <Switch
                checked={draft.isPublished}
                onChange={(v) => setDraft({ ...draft, isPublished: v })}
                label={f.published}
              />
              {f.publishHint}
            </label>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-medium text-zinc-700">
                  {f.gallery}
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setPickerOpen(true)}
                >
                  <Plus className="size-3.5" />
                  {f.addImage}
                </Button>
              </div>
              {draft.images.length === 0 ? (
                <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-8 text-center text-xs text-zinc-400">
                  {t("pages.gallery.emptyAlbum")}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {draft.images.map((img, index) => (
                    <div
                      key={`${img.src}-${index}`}
                      className="group relative overflow-hidden rounded-lg border border-zinc-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={assetUrl(img.src)}
                        alt=""
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-1 bg-zinc-900/40 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => moveImage(index, -1)}
                          className="rounded bg-white p-1 text-zinc-700"
                          aria-label={t("aria.moveUp")}
                        >
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(index, 1)}
                          className="rounded bg-white p-1 text-zinc-700"
                          aria-label={t("aria.moveDown")}
                        >
                          <ArrowDown className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDraft({
                              ...draft,
                              images: draft.images.filter((_, i) => i !== index),
                            })
                          }
                          className="rounded bg-white p-1 text-red-600"
                          aria-label={t("aria.remove")}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <MediaLibraryModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(item) => {
          if (!draft) return;
          setDraft({
            ...draft,
            images: [...draft.images, { src: item.url }],
            coverImage: draft.coverImage || item.url,
          });
        }}
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("pages.gallery.create")}
      >
        <div className="space-y-4">
          <FormField label={f.slug} hint={t("pages.pages.slugHint")}>
            <Input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
            />
          </FormField>
          <FormField label={`${t("pages.gallery.albumTitle")} (EN)`}>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              loading={createMutation.isPending}
              disabled={!newSlug || !newTitle}
              onClick={() => createMutation.mutate()}
            >
              {t("common.create")}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteAlbum}
        onClose={() => setDeleteAlbum(null)}
        onConfirm={() =>
          deleteAlbum && deleteMutation.mutate(deleteAlbum._id)
        }
        title={t("pages.gallery.deleteTitle")}
        message={t("pages.gallery.deleteMessage", {
          name: deleteAlbum?.title.en ?? "",
        })}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
