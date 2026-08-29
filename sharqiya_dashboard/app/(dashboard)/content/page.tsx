"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { api, apiErrorMessage } from "@/lib/api";
import { toast } from "@/lib/stores/toast-store";
import type { AboutContent, HomepageContent, Localized } from "@/lib/types";
import { emptyLocalized } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSyncedDraft } from "@/lib/use-synced-draft";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { ImagePicker } from "@/components/ui/image-picker";
import { Input, Textarea } from "@/components/ui/input";
import { LocalizedListEditor } from "@/components/ui/localized-list-editor";
import { LocalizedTabs } from "@/components/ui/localized-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { useT } from "@/lib/i18n/use-t";

type SectionKey = "homepage" | "about";

function useContent<T>(key: SectionKey) {
  return useQuery({
    queryKey: ["content", key],
    queryFn: async () => (await api.get<T>(`/content/${key}`)).data,
  });
}

function useSaveContent(key: SectionKey) {
  const t = useT();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => api.put(`/content/${key}`, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", key] });
      toast.success(t("toast.contentSaved"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-zinc-900">{title}</h2>
      {children}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex h-40 items-center justify-center">
      <LoaderCircle className="size-5 animate-spin text-zinc-400" />
    </div>
  );
}

function LocFields({
  value,
  onChange,
  fields,
}: {
  value: Record<string, Localized>;
  onChange: (next: Record<string, Localized>) => void;
  fields: { key: string; label: string; multiline?: boolean }[];
}) {
  return (
    <LocalizedTabs>
      {(lang) => (
        <div className="space-y-3">
          {fields.map((field) => (
            <FormField
              key={field.key}
              label={`${field.label} (${lang.toUpperCase()})`}
            >
              {field.multiline ? (
                <Textarea
                  dir={lang === "ar" ? "rtl" : undefined}
                  value={value[field.key]?.[lang] ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      [field.key]: {
                        en: value[field.key]?.en ?? "",
                        ar: value[field.key]?.ar ?? "",
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              ) : (
                <Input
                  dir={lang === "ar" ? "rtl" : undefined}
                  value={value[field.key]?.[lang] ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      [field.key]: {
                        en: value[field.key]?.en ?? "",
                        ar: value[field.key]?.ar ?? "",
                        [lang]: e.target.value,
                      },
                    })
                  }
                />
              )}
            </FormField>
          ))}
        </div>
      )}
    </LocalizedTabs>
  );
}

export default function ContentPage() {
  const t = useT();
  const [active, setActive] = useState<SectionKey>("homepage");
  const tabs = [
    { key: "homepage" as const, label: t("pages.content.homepage") },
    { key: "about" as const, label: t("pages.content.about") },
  ];

  return (
    <div>
      <PageHeader page="content" />
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-zinc-200">
        {tabs.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={cn(
              "-mb-px cursor-pointer border-b-2 px-3 py-2 text-[13px] font-medium transition",
              active === s.key
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-zinc-500 hover:text-zinc-800",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      {active === "homepage" ? <HomepageEditor /> : <AboutEditor />}
    </div>
  );
}

function HomepageEditor() {
  const t = useT();
  const { data, isLoading } = useContent<HomepageContent>("homepage");
  const save = useSaveContent("homepage");
  const [draft, setDraft] = useSyncedDraft<HomepageContent>(Boolean(data), () =>
    data ? structuredClone(data) : null,
  );

  if (isLoading || !draft) return <Loading />;

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button loading={save.isPending} onClick={() => save.mutate(draft)}>
          <Save className="size-4" />
          {t("common.save")}
        </Button>
      </div>

      <Card title={t("pages.content.hero")}>
        <LocFields
          value={{
            eyebrow: draft.hero.eyebrow,
            titleLine1: draft.hero.titleLine1,
            titleLine2: draft.hero.titleLine2,
            subtitle: draft.hero.subtitle,
            primaryCta: draft.hero.primaryCta,
            secondaryCta: draft.hero.secondaryCta,
          }}
          onChange={(next) =>
            setDraft({
              ...draft,
              hero: { ...draft.hero, ...next },
            })
          }
          fields={[
            { key: "eyebrow", label: t("pages.content.eyebrow") },
            { key: "titleLine1", label: t("pages.content.titleLine1") },
            { key: "titleLine2", label: t("pages.content.titleLine2") },
            {
              key: "subtitle",
              label: t("forms.subtitle"),
              multiline: true,
            },
            { key: "primaryCta", label: t("pages.content.primaryCta") },
            { key: "secondaryCta", label: t("pages.content.secondaryCta") },
          ]}
        />
        <div className="mt-4 space-y-2">
          <p className="text-[13px] font-medium text-zinc-700">
            {t("pages.content.addSlide")}
          </p>
          {draft.hero.slides.map((src, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1">
                <ImagePicker
                  value={src}
                  onChange={(url) => {
                    const slides = [...draft.hero.slides];
                    slides[i] = url;
                    setDraft({ ...draft, hero: { ...draft.hero, slides } });
                  }}
                  label={`${t("forms.image")} ${i + 1}`}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setDraft({
                    ...draft,
                    hero: {
                      ...draft.hero,
                      slides: draft.hero.slides.filter((_, idx) => idx !== i),
                    },
                  })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              setDraft({
                ...draft,
                hero: { ...draft.hero, slides: [...draft.hero.slides, ""] },
              })
            }
          >
            <Plus className="size-3.5" />
            {t("pages.content.addSlide")}
          </Button>
        </div>
      </Card>

      <Card title={t("pages.content.intro")}>
        <LocFields
          value={draft.intro}
          onChange={(next) =>
            setDraft({
              ...draft,
              intro: { heading: next.heading, body: next.body },
            })
          }
          fields={[
            { key: "heading", label: t("pages.content.heading") },
            { key: "body", label: t("pages.content.body"), multiline: true },
          ]}
        />
      </Card>

      <Card title={t("pages.content.stats")}>
        {draft.stats.map((stat, i) => (
          <div
            key={i}
            className="mb-3 grid gap-2 rounded-lg border border-zinc-100 p-3 sm:grid-cols-[120px_1fr_1fr_auto]"
          >
            <Input
              value={stat.value}
              onChange={(e) => {
                const stats = [...draft.stats];
                stats[i] = { ...stat, value: e.target.value };
                setDraft({ ...draft, stats });
              }}
              placeholder={t("pages.content.value")}
            />
            <Input
              value={stat.label.en}
              onChange={(e) => {
                const stats = [...draft.stats];
                stats[i] = {
                  ...stat,
                  label: { ...stat.label, en: e.target.value },
                };
                setDraft({ ...draft, stats });
              }}
              placeholder="EN"
            />
            <Input
              dir="rtl"
              value={stat.label.ar}
              onChange={(e) => {
                const stats = [...draft.stats];
                stats[i] = {
                  ...stat,
                  label: { ...stat.label, ar: e.target.value },
                };
                setDraft({ ...draft, stats });
              }}
              placeholder="AR"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                setDraft({
                  ...draft,
                  stats: draft.stats.filter((_, idx) => idx !== i),
                })
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            setDraft({
              ...draft,
              stats: [...draft.stats, { value: "", label: emptyLocalized() }],
            })
          }
        >
          <Plus className="size-3.5" />
          {t("pages.content.addStat")}
        </Button>
      </Card>

      <Card title={t("pages.content.values")}>
        {draft.values.map((item, i) => (
          <div key={i} className="mb-4 rounded-lg border border-zinc-100 p-3">
            <div className="mb-2 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setDraft({
                    ...draft,
                    values: draft.values.filter((_, idx) => idx !== i),
                  })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <FormField label={t("pages.content.icon")}>
              <Input
                value={item.icon}
                onChange={(e) => {
                  const values = [...draft.values];
                  values[i] = { ...item, icon: e.target.value };
                  setDraft({ ...draft, values });
                }}
              />
            </FormField>
            <div className="mt-3">
              <LocFields
                value={{ title: item.title, body: item.body }}
                onChange={(next) => {
                  const values = [...draft.values];
                  values[i] = {
                    ...item,
                    title: next.title,
                    body: next.body,
                  };
                  setDraft({ ...draft, values });
                }}
                fields={[
                  { key: "title", label: t("pages.content.heading") },
                  {
                    key: "body",
                    label: t("pages.content.body"),
                    multiline: true,
                  },
                ]}
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            setDraft({
              ...draft,
              values: [
                ...draft.values,
                {
                  icon: "",
                  title: emptyLocalized(),
                  body: emptyLocalized(),
                },
              ],
            })
          }
        >
          <Plus className="size-3.5" />
          {t("pages.content.addValue")}
        </Button>
      </Card>

      <Card title={t("pages.content.process")}>
        {draft.process.map((step, i) => (
          <div key={i} className="mb-4 rounded-lg border border-zinc-100 p-3">
            <div className="mb-2 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setDraft({
                    ...draft,
                    process: draft.process.filter((_, idx) => idx !== i),
                  })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <LocFields
              value={{ title: step.title, body: step.body }}
              onChange={(next) => {
                const process = [...draft.process];
                process[i] = { title: next.title, body: next.body };
                setDraft({ ...draft, process });
              }}
              fields={[
                { key: "title", label: t("pages.content.heading") },
                {
                  key: "body",
                  label: t("pages.content.body"),
                  multiline: true,
                },
              ]}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            setDraft({
              ...draft,
              process: [
                ...draft.process,
                { title: emptyLocalized(), body: emptyLocalized() },
              ],
            })
          }
        >
          <Plus className="size-3.5" />
          {t("pages.content.addStep")}
        </Button>
      </Card>

      <Card title={t("pages.content.clients")}>
        <LocFields
          value={{
            heading: draft.clients.heading,
            note: draft.clients.note,
          }}
          onChange={(next) =>
            setDraft({
              ...draft,
              clients: {
                ...draft.clients,
                heading: next.heading,
                note: next.note,
              },
            })
          }
          fields={[
            { key: "heading", label: t("pages.content.heading") },
            { key: "note", label: t("pages.content.note"), multiline: true },
          ]}
        />
        <div className="mt-4">
          <LocalizedListEditor
            label={t("pages.content.clients")}
            value={draft.clients.items}
            onChange={(items) =>
              setDraft({
                ...draft,
                clients: { ...draft.clients, items },
              })
            }
            addLabel={t("pages.content.addClient")}
          />
        </div>
      </Card>

      <Card title={t("pages.content.cta")}>
        <LocFields
          value={{
            heading: draft.cta.heading,
            body: draft.cta.body,
            primaryCta: draft.cta.primaryCta,
            secondaryCta: draft.cta.secondaryCta,
          }}
          onChange={(next) =>
            setDraft({ ...draft, cta: { ...draft.cta, ...next } })
          }
          fields={[
            { key: "heading", label: t("pages.content.heading") },
            { key: "body", label: t("pages.content.body"), multiline: true },
            { key: "primaryCta", label: t("pages.content.primaryCta") },
            { key: "secondaryCta", label: t("pages.content.secondaryCta") },
          ]}
        />
        <div className="mt-4">
          <ImagePicker
            value={draft.cta.image}
            onChange={(image) =>
              setDraft({ ...draft, cta: { ...draft.cta, image } })
            }
          />
        </div>
      </Card>
    </div>
  );
}

function AboutEditor() {
  const t = useT();
  const { data, isLoading } = useContent<AboutContent>("about");
  const save = useSaveContent("about");
  const [draft, setDraft] = useSyncedDraft<AboutContent>(Boolean(data), () =>
    data ? structuredClone(data) : null,
  );

  if (isLoading || !draft) return <Loading />;

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button loading={save.isPending} onClick={() => save.mutate(draft)}>
          <Save className="size-4" />
          {t("common.save")}
        </Button>
      </div>

      <Card title={t("pages.content.hero")}>
        <LocFields
          value={{
            eyebrow: draft.hero.eyebrow,
            title: draft.hero.title,
            subtitle: draft.hero.subtitle,
          }}
          onChange={(next) =>
            setDraft({ ...draft, hero: { ...draft.hero, ...next } })
          }
          fields={[
            { key: "eyebrow", label: t("pages.content.eyebrow") },
            { key: "title", label: t("pages.content.heading") },
            {
              key: "subtitle",
              label: t("forms.subtitle"),
              multiline: true,
            },
          ]}
        />
        <div className="mt-4">
          <ImagePicker
            value={draft.hero.image}
            onChange={(image) =>
              setDraft({ ...draft, hero: { ...draft.hero, image } })
            }
          />
        </div>
      </Card>

      <Card title={t("forms.sections")}>
        {draft.sections.map((section, i) => (
          <div key={i} className="mb-4 rounded-lg border border-zinc-100 p-3">
            <div className="mb-2 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setDraft({
                    ...draft,
                    sections: draft.sections.filter((_, idx) => idx !== i),
                  })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <LocFields
              value={{ heading: section.heading, body: section.body }}
              onChange={(next) => {
                const sections = [...draft.sections];
                sections[i] = { ...section, ...next };
                setDraft({ ...draft, sections });
              }}
              fields={[
                { key: "heading", label: t("pages.content.heading") },
                {
                  key: "body",
                  label: t("pages.content.body"),
                  multiline: true,
                },
              ]}
            />
            <div className="mt-3">
              <ImagePicker
                value={section.image}
                onChange={(image) => {
                  const sections = [...draft.sections];
                  sections[i] = { ...section, image };
                  setDraft({ ...draft, sections });
                }}
              />
            </div>
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
                  image: "",
                },
              ],
            })
          }
        >
          <Plus className="size-3.5" />
          {t("forms.addSection")}
        </Button>
      </Card>

      <Card title={t("pages.content.milestones")}>
        {draft.milestones.map((m, i) => (
          <div
            key={i}
            className="mb-3 rounded-lg border border-zinc-100 p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <Input
                className="w-28"
                value={m.year}
                onChange={(e) => {
                  const milestones = [...draft.milestones];
                  milestones[i] = { ...m, year: e.target.value };
                  setDraft({ ...draft, milestones });
                }}
                placeholder={t("pages.content.year")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setDraft({
                    ...draft,
                    milestones: draft.milestones.filter((_, idx) => idx !== i),
                  })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <LocFields
              value={{ title: m.title, body: m.body }}
              onChange={(next) => {
                const milestones = [...draft.milestones];
                milestones[i] = { ...m, ...next };
                setDraft({ ...draft, milestones });
              }}
              fields={[
                { key: "title", label: t("pages.content.heading") },
                {
                  key: "body",
                  label: t("pages.content.body"),
                  multiline: true,
                },
              ]}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            setDraft({
              ...draft,
              milestones: [
                ...draft.milestones,
                {
                  year: "",
                  title: emptyLocalized(),
                  body: emptyLocalized(),
                },
              ],
            })
          }
        >
          <Plus className="size-3.5" />
          {t("pages.content.addMilestone")}
        </Button>
      </Card>
    </div>
  );
}
