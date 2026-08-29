"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, LoaderCircle, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { api, apiErrorMessage, assetUrl } from "@/lib/api";
import { toast } from "@/lib/stores/toast-store";
import type { MediaItem, Paginated } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/use-t";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface MediaLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post<MediaItem>("/media/upload", form);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });
}

export function MediaLibraryModal({
  open,
  onClose,
  onSelect,
}: MediaLibraryModalProps) {
  const t = useT();
  const [page, setPage] = useState(1);
  const fileInput = useRef<HTMLInputElement>(null);
  const upload = useUploadMedia();

  const { data, isLoading } = useQuery({
    queryKey: ["media", page],
    queryFn: async () => {
      const res = await api.get<Paginated<MediaItem>>("/media", {
        params: { page, limit: 24 },
      });
      return res.data;
    },
    enabled: open,
  });

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      for (const file of Array.from(files)) {
        const item = await upload.mutateAsync(file);
        onSelect(item);
      }
      onClose();
    },
    [upload, onSelect, onClose],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("mediaLibrary.title")}
      widthClass="max-w-3xl"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-500">{t("mediaLibrary.hint")}</p>
        <Button
          size="sm"
          onClick={() => fileInput.current?.click()}
          loading={upload.isPending}
        >
          <Upload className="size-3.5" />
          {t("mediaLibrary.upload")}
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <LoaderCircle className="size-5 animate-spin text-zinc-400" />
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center text-zinc-400">
          <ImageIcon className="mb-2 size-7" />
          <p className="text-sm">{t("mediaLibrary.empty")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {data.data.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 transition hover:border-brand-400 hover:ring-2 hover:ring-brand-100"
                title={item.filename}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assetUrl(item.thumbUrl || item.url)}
                  alt={item.filename}
                  className="size-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
          {data.meta.pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                {t("mediaLibrary.back")}
              </Button>
              <span className="text-xs text-zinc-500">
                {page} / {data.meta.pages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= data.meta.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                {t("mediaLibrary.next")}
              </Button>
            </div>
          )}
        </>
      )}
      <div
        className={cn(
          "mt-4 rounded-lg border border-dashed border-zinc-200 p-3 text-center text-xs text-zinc-400",
          upload.isPending && "opacity-50",
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        {t("mediaLibrary.drop")}
      </div>
    </Modal>
  );
}
