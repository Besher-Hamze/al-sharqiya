"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { Spec } from "@/lib/types";
import { emptyLocalized } from "@/lib/types";
import { useT } from "@/lib/i18n/use-t";
import { Button } from "./button";
import { Input } from "./input";

interface SpecsEditorProps {
  label: string;
  value: Spec[];
  onChange: (value: Spec[]) => void;
  addLabel?: string;
}

export function SpecsEditor({
  label,
  value,
  onChange,
  addLabel,
}: SpecsEditorProps) {
  const t = useT();

  const update = (
    index: number,
    field: "label" | "value",
    lang: "en" | "ar",
    text: string,
  ) => {
    onChange(
      value.map((item, i) =>
        i === index
          ? { ...item, [field]: { ...item[field], [lang]: text } }
          : item,
      ),
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
          {t("editors.emptySpecs")}
        </p>
      )}
      {value.map((item, index) => (
        <div
          key={index}
          className="space-y-1.5 rounded-lg border border-zinc-100 bg-zinc-50/50 p-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">{index + 1}</span>
            <div className="flex gap-0.5">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="cursor-pointer rounded p-1 text-zinc-400 hover:bg-zinc-100 disabled:opacity-30"
                aria-label={t("aria.moveUp")}
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
                className="cursor-pointer rounded p-1 text-zinc-400 hover:bg-zinc-100 disabled:opacity-30"
                aria-label={t("aria.moveDown")}
              >
                <ArrowDown className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="cursor-pointer rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                aria-label={t("aria.remove")}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            <Input
              value={item.label.en}
              onChange={(e) => update(index, "label", "en", e.target.value)}
              placeholder={`${t("editors.specLabel")} EN`}
            />
            <Input
              value={item.label.ar}
              onChange={(e) => update(index, "label", "ar", e.target.value)}
              placeholder={`${t("editors.specLabel")} AR`}
              dir="rtl"
            />
            <Input
              value={item.value.en}
              onChange={(e) => update(index, "value", "en", e.target.value)}
              placeholder={`${t("editors.specValue")} EN`}
            />
            <Input
              value={item.value.ar}
              onChange={(e) => update(index, "value", "ar", e.target.value)}
              placeholder={`${t("editors.specValue")} AR`}
              dir="rtl"
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
            { label: emptyLocalized(), value: emptyLocalized() },
          ])
        }
      >
        <Plus className="size-3.5" />
        {addLabel ?? t("forms.addSpec")}
      </Button>
    </div>
  );
}
