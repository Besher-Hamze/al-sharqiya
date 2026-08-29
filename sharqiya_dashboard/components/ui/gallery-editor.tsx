"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ContentImage } from "@/lib/types";
import { emptyLocalized } from "@/lib/types";
import { assetUrl } from "@/lib/api";
import { useT } from "@/lib/i18n/use-t";
import { useFormLabels } from "@/lib/i18n/use-form-labels";
import { Button } from "./button";
import { FormField } from "./form-field";
import { Input } from "./input";
import { ImagePicker } from "./image-picker";
import { LocalizedTabs } from "./localized-tabs";

interface GalleryEditorProps {
  label: string;
  value: ContentImage[];
  onChange: (value: ContentImage[]) => void;
  hint?: string;
  compact?: boolean;
}

export function GalleryEditor({
  label,
  value,
  onChange,
  hint,
  compact = false,
}: GalleryEditorProps) {
  const t = useT();
  const f = useFormLabels();
  const resolvedHint = hint ?? t("editors.galleryHint");

  const update = (index: number, patch: Partial<ContentImage>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[13px] font-medium text-zinc-700">{label}</p>
        {resolvedHint ? (
          <p className="mt-0.5 text-xs text-zinc-400">{resolvedHint}</p>
        ) : null}
      </div>

      {value.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-4 text-center text-xs text-zinc-400">
          {compact ? t("editors.emptySectionImages") : t("editors.emptyGallery")}
        </p>
      ) : null}

      {value.map((item, index) => (
        <div
          key={index}
          className={
            compact
              ? "rounded-lg border border-zinc-200 bg-white p-3"
              : "rounded-xl border border-zinc-200 bg-zinc-50/40 p-4"
          }
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {item.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={assetUrl(item.src)}
                  alt=""
                  className="size-10 rounded-lg border border-zinc-100 object-cover"
                />
              ) : null}
              <p className="text-xs font-medium text-zinc-400">
                {t("editors.imageN", { n: index + 1 })}
              </p>
            </div>
            <div className="flex gap-0.5">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="cursor-pointer rounded p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30"
                aria-label={t("aria.moveUp")}
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
                className="cursor-pointer rounded p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30"
                aria-label={t("aria.moveDown")}
              >
                <ArrowDown className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="cursor-pointer rounded p-1 text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label={t("aria.remove")}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>

          <ImagePicker
            label={f.image}
            value={item.src}
            onChange={(src) => update(index, { src })}
          />

          <div className="mt-3">
            <LocalizedTabs>
              {(lang) => (
                <div className="space-y-3">
                  <FormField label={lang === "en" ? f.altEn : f.altAr}>
                    <Input
                      dir={lang === "ar" ? "rtl" : undefined}
                      value={item.alt?.[lang] ?? ""}
                      onChange={(e) =>
                        update(index, {
                          alt: {
                            en: item.alt?.en ?? "",
                            ar: item.alt?.ar ?? "",
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                  </FormField>
                  <FormField
                    label={`${t("editors.caption")} (${lang.toUpperCase()})`}
                  >
                    <Input
                      dir={lang === "ar" ? "rtl" : undefined}
                      value={item.caption?.[lang] ?? ""}
                      onChange={(e) =>
                        update(index, {
                          caption: {
                            en: item.caption?.en ?? "",
                            ar: item.caption?.ar ?? "",
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                  </FormField>
                </div>
              )}
            </LocalizedTabs>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() =>
          onChange([
            ...value,
            { src: "", alt: emptyLocalized(), caption: emptyLocalized() },
          ])
        }
      >
        <Plus className="size-3.5" />
        {f.addImage}
      </Button>
    </div>
  );
}
