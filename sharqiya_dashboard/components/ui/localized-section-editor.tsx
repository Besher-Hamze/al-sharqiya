"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ContentImage, ContentSection } from "@/lib/types";
import { emptyLocalized } from "@/lib/types";
import { useT } from "@/lib/i18n/use-t";
import { Button } from "./button";
import { FormField } from "./form-field";
import { Input, Textarea } from "./input";
import { LocalizedTabs } from "./localized-tabs";
import { GalleryEditor } from "./gallery-editor";

interface LocalizedSectionEditorProps {
  label: string;
  value: ContentSection[];
  onChange: (value: ContentSection[]) => void;
  addLabel?: string;
  hint?: string;
}

export function LocalizedSectionEditor({
  label,
  value,
  onChange,
  addLabel,
  hint,
}: LocalizedSectionEditorProps) {
  const t = useT();
  const resolvedAddLabel = addLabel ?? t("forms.addSection");

  const update = (index: number, patch: Partial<ContentSection>) => {
    onChange(value.map((s, i) => (i === index ? { ...s, ...patch } : s)));
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
        {hint ? <p className="mt-0.5 text-xs text-zinc-400">{hint}</p> : null}
      </div>

      {value.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-4 text-center text-xs text-zinc-400">
          {t("editors.emptySections")}
        </p>
      ) : null}

      {value.map((section, index) => (
        <div
          key={index}
          className="rounded-xl border border-zinc-200 bg-zinc-50/40 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-400">
              {t("editors.sectionN", { n: index + 1 })}
            </p>
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
          <LocalizedTabs>
            {(lang) => (
              <div className="space-y-3">
                <FormField label={`${t("editors.heading")} (${lang.toUpperCase()})`}>
                  <Input
                    dir={lang === "ar" ? "rtl" : undefined}
                    value={section.heading[lang]}
                    onChange={(e) =>
                      update(index, {
                        heading: { ...section.heading, [lang]: e.target.value },
                      })
                    }
                  />
                </FormField>
                <FormField label={`${t("editors.body")} (${lang.toUpperCase()})`}>
                  <Textarea
                    dir={lang === "ar" ? "rtl" : undefined}
                    className="min-h-24"
                    value={section.body[lang]}
                    onChange={(e) =>
                      update(index, {
                        body: { ...section.body, [lang]: e.target.value },
                      })
                    }
                  />
                </FormField>
              </div>
            )}
          </LocalizedTabs>

          <div className="mt-4 border-t border-zinc-200 pt-4">
            <GalleryEditor
              compact
              label={t("forms.addImage")}
              hint={t("editors.sectionImagesHint")}
              value={section.images ?? []}
              onChange={(images: ContentImage[]) => update(index, { images })}
            />
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
            { heading: emptyLocalized(), body: emptyLocalized(), images: [] },
          ])
        }
      >
        <Plus className="size-3.5" />
        {resolvedAddLabel}
      </Button>
    </div>
  );
}
