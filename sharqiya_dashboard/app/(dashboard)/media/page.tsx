"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Image as ImageIcon, LoaderCircle, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { api, apiErrorMessage, assetUrl } from "@/lib/api";
import { toast } from "@/lib/stores/toast-store";
import type { MediaItem, Paginated } from "@/lib/types";
import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { useT } from "@/lib/i18n/use-t";
import { useTableLabels } from "@/lib/i18n/use-table-labels";
import { useUploadMedia } from "@/components/media/media-library-modal";

export default function MediaPage() {
  const t = useT();
  const tbl = useTableLabels();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const upload = useUploadMedia();

  const { data, isLoading } = useQuery({
    queryKey: ["media", page],
    queryFn: async () =>
      (
        await api.get<Paginated<MediaItem>>("/media", {
          params: { page, limit: 30 },
        })
      ).data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      setDeleteTarget(null);
      toast.success(t("toast.mediaDeleted"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      try {
        await upload.mutateAsync(file);
      } catch {
        // toast already shown
      }
    }
    toast.success(
      files.length > 1
        ? t("pages.media.uploadMultiple", { count: files.length })
        : t("toast.uploadSuccess"),
    );
  };

  const copyUrl = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(assetUrl(item.url));
      toast.success(t("toast.copySuccess"));
    } catch {
      toast.error(t("toast.copyFailed"));
    }
  };

  return (
    <div>
      <PageHeader
        page="media"
        actions={
          <Button
            onClick={() => fileInput.current?.click()}
            loading={upload.isPending}
          >
            <Upload className="size-4" />
            {t("common.upload")}
          </Button>
        }
      />
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div
        className={cn(
          "mb-5 rounded-xl border-2 border-dashed p-6 text-center transition",
          dragging
            ? "border-brand-400 bg-brand-50"
            : "border-zinc-200 bg-white text-zinc-400",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="mx-auto mb-1.5 size-5" />
        <p className="text-sm">
          {t("pages.media.dropHint")}{" "}
          <button
            onClick={() => fileInput.current?.click()}
            className="cursor-pointer font-medium text-brand-600 hover:underline"
          >
            {t("common.browse")}
          </button>
        </p>
        <p className="mt-0.5 text-xs">{t("pages.media.dropLimit")}</p>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <LoaderCircle className="size-5 animate-spin text-zinc-400" />
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-400">
          <ImageIcon className="mb-2 size-7" />
          <p className="text-sm">{t("pages.media.empty")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {data.data.map((item) => (
              <div
                key={item._id}
                className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-square bg-zinc-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={assetUrl(item.thumbUrl || item.url)}
                    alt={item.filename}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-zinc-900/50 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => copyUrl(item)}
                      className="cursor-pointer rounded-lg bg-white/90 p-2 text-zinc-700 transition hover:bg-white"
                      title={t("aria.copyLink")}
                    >
                      <Copy className="size-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="cursor-pointer rounded-lg bg-white/90 p-2 text-red-600 transition hover:bg-white"
                      title={tbl.delete}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="px-2.5 py-2">
                  <p
                    className="truncate text-xs font-medium text-zinc-700"
                    title={item.filename}
                  >
                    {item.filename}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    {formatBytes(item.size)}
                    {item.width && item.height
                      ? ` · ${item.width}×${item.height}`
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {data.meta.pages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                {t("common.back")}
              </Button>
              <span className="text-xs text-zinc-500">
                {t("pagination.summary", {
                  total: data.meta.total,
                  page,
                  pages: data.meta.pages,
                })}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= data.meta.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                {t("common.next")}
              </Button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate(deleteTarget._id)
        }
        title={t("pages.media.deleteTitle")}
        message={t("pages.media.deleteMessage", {
          name: deleteTarget?.filename ?? "",
        })}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
