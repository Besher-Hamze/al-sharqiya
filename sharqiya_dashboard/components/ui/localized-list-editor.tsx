"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { Localized } from "@/lib/types";
import { emptyLocalized } from "@/lib/types";
import { useT } from "@/lib/i18n/use-t";
import { Button } from "./button";
import { Input } from "./input";

interface LocalizedListEditorProps {
  label: string;
  value: Localized[];
  onChange: (value: Localized[]) => void;
  addLabel?: string;
}

export function LocalizedListEditor({
  label,
  value,
  onChange,
  addLabel,
}: LocalizedListEditorProps) {
  const t = useT();
  const resolvedAddLabel = addLabel ?? t("editors.addItem");

  const update = (index: number, lang: "en" | "ar", text: string) => {
    onChange(
      value.map((item, i) => (i === index ? { ...item, [lang]: text } : item)),
    );
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <p className="text-[13px] font-medium text-zinc-700">{label}</p>
      {value.length === 0 && (
        <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-4 text-center text-xs text-zinc-400">
          {t("editors.emptyItems")}
        </p>
      )}
      {value.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-2 rounded-lg border border-zinc-100 bg-zinc-50/50 p-2"
        >
          <span className="mt-2 w-5 shrink-0 text-center text-xs text-zinc-400">
            {index + 1}
          </span>
          <div className="grid flex-1 gap-1.5 sm:grid-cols-2">
            <Input
              value={item.en}
              onChange={(e) => update(index, "en", e.target.value)}
              placeholder={t("common.english")}
            />
            <Input
              value={item.ar}
              onChange={(e) => update(index, "ar", e.target.value)}
              placeholder={t("common.arabic")}
              dir="rtl"
            />
          </div>
          <div className="flex shrink-0 items-center gap-0.5 pt-1">
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="cursor-pointer rounded p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={t("aria.moveUp")}
            >
              <ArrowUp className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === value.length - 1}
              className="cursor-pointer rounded p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30"
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
      ))}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => onChange([...value, emptyLocalized()])}
      >
        <Plus className="size-3.5" />
        {resolvedAddLabel}
      </Button>
    </div>
  );
}
