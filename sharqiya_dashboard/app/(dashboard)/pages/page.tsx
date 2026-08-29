"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  LoaderCircle,
  Plus,
  Save,
  ScrollText,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { api, apiErrorMessage } from "@/lib/api";
import { useSyncedDraft } from "@/lib/use-synced-draft";
import { toast } from "@/lib/stores/toast-store";
import type { ContentSection, LegalPage, Paginated } from "@/lib/types";
import { emptyLocalized } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { LocalizedTabs } from "@/components/ui/localized-tabs";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { useT } from "@/lib/i18n/use-t";
import { useFormLabels } from "@/lib/i18n/use-form-labels";

interface Draft {
  title: { en: string; ar: string };
  sections: ContentSection[];
  isPublished: boolean;
}

export default function PagesPage() {
  const t = useT();
  const f = useFormLabels();
  const queryClient = useQueryClient();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const { data: pages, isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: async () =>
      (
        await api.get<Paginated<LegalPage>>("/pages/admin", {
          params: { limit: 50, sort: "order" },
        })
      ).data.data,
  });

  const selected =
    pages?.find((p) => p.slug === selectedSlug) ?? pages?.[0];

  const [draft, setDraft] = useSyncedDraft<Draft>(selected?._id, () =>
    selected
      ? structuredClone({
          title: selected.title,
          sections: selected.sections ?? [],
          isPublished: selected.isPublished,
        })
      : null,
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selected || !draft) return;
      return api.patch(`/pages/${selected._id}`, draft);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success(t("toast.pageSaved"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const createMutation = useMutation({
    mutationFn: async () =>
      api.post("/pages", {
        slug: newSlug,
        title: { en: newTitle, ar: "" },
        sections: [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      setCreateOpen(false);
      setSelectedSlug(newSlug);
      setNewSlug("");
      setNewTitle("");
      toast.success(t("toast.pageCreated"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const updateSection = (index: number, patch: Partial<ContentSection>) => {
    if (!draft) return;
    setDraft({
      ...draft,
      sections: draft.sections.map((s, i) =>
        i === index ? { ...s, ...patch } : s,
      ),
    });
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    if (!draft) return;
    const target = index + dir;
    if (target < 0 || target >= draft.sections.length) return;
    const next = [...draft.sections];
    [next[index], next[target]] = [next[target], next[index]];
    setDraft({ ...draft, sections: next });
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
        page="pages"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            {t("pages.pages.create")}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="space-y-1">
          {(pages ?? []).length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-zinc-400">
              {t("pages.pages.empty")}
            </p>
          )}
          {(pages ?? []).map((page) => (
            <button
              key={page._id}
              onClick={() => setSelectedSlug(page.slug)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-start text-[13px] transition",
                selected?.slug === page.slug
                  ? "bg-brand-50 text-brand-700"
                  : "text-zinc-600 hover:bg-zinc-50",
              )}
            >
              <ScrollText className="size-3.5 shrink-0" />
              <span className="truncate">{page.title.en || page.slug}</span>
            </button>
          ))}
        </div>

        {selected && draft && (
          <div className="space-y-5">
            <div className="flex justify-end">
              <Button
                size="sm"
                loading={saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
              >
                <Save className="size-3.5" />
                {t("common.save")}
              </Button>
            </div>

            <LocalizedTabs>
              {(lang) => (
                <FormField
                  label={`${t("pages.pages.pageTitle")} (${lang.toUpperCase()})`}
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

            <div className="space-y-3">
              {draft.sections.map((section, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-200 bg-zinc-50/40 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-medium text-zinc-400">
                      {t("pages.pages.sectionN", { n: index + 1 })}
                    </p>
                    <div className="flex gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveSection(index, -1)}
                        className="cursor-pointer rounded p-1 text-zinc-400 hover:bg-zinc-100"
                        aria-label={t("aria.moveUp")}
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(index, 1)}
                        className="cursor-pointer rounded p-1 text-zinc-400 hover:bg-zinc-100"
                        aria-label={t("aria.moveDown")}
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            sections: draft.sections.filter(
                              (_, i) => i !== index,
                            ),
                          })
                        }
                        className="cursor-pointer rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                        aria-label={t("aria.remove")}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <LocalizedTabs>
                    {(lang) => (
                      <div className="space-y-3">
                        <FormField
                          label={`${t("editors.heading")} (${lang.toUpperCase()})`}
                        >
                          <Input
                            dir={lang === "ar" ? "rtl" : undefined}
                            value={section.heading[lang]}
                            onChange={(e) =>
                              updateSection(index, {
                                heading: {
                                  ...section.heading,
                                  [lang]: e.target.value,
                                },
                              })
                            }
                          />
                        </FormField>
                        <FormField
                          label={`${t("editors.body")} (${lang.toUpperCase()})`}
                        >
                          <Textarea
                            dir={lang === "ar" ? "rtl" : undefined}
                            value={section.body[lang]}
                            onChange={(e) =>
                              updateSection(index, {
                                body: {
                                  ...section.body,
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
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setDraft({
                    ...draft,
                    sections: [
                      ...draft.sections,
                      {
                        heading: emptyLocalized(),
                        body: emptyLocalized(),
                      },
                    ],
                  })
                }
              >
                <Plus className="size-3.5" />
                {f.addSection}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("pages.pages.create")}
      >
        <div className="space-y-4">
          <FormField label={f.slug} hint={t("pages.pages.slugHint")}>
            <Input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
            />
          </FormField>
          <FormField label={`${t("pages.pages.pageTitle")} (EN)`}>
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
    </div>
  );
}
