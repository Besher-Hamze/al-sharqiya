"use client";

import { Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { assetUrl } from "@/lib/api";
import { useT } from "@/lib/i18n/use-t";
import { MediaLibraryModal } from "@/components/media/media-library-modal";
import { Button } from "./button";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  const t = useT();
  const resolvedLabel = label ?? t("forms.image");
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1.5">
      <p className="text-[13px] font-medium text-zinc-700">{resolvedLabel}</p>
      <div className="flex items-center gap-3">
        <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetUrl(value)}
                alt=""
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute end-1 top-1 cursor-pointer rounded-full bg-zinc-900/60 p-0.5 text-white transition hover:bg-zinc-900"
                aria-label={t("aria.removeImage")}
              >
                <X className="size-3" />
              </button>
            </>
          ) : (
            <ImageIcon className="size-6 text-zinc-300" />
          )}
        </div>
        <div className="space-y-1">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setOpen(true)}
          >
            {t("forms.selectImage")}
          </Button>
          {value && (
            <p className="max-w-56 truncate text-xs text-zinc-400">{value}</p>
          )}
        </div>
      </div>
      <MediaLibraryModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(item) => onChange(item.url)}
      />
    </div>
  );
}
