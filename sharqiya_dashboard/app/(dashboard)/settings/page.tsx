"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { useSyncedDraft } from "@/lib/use-synced-draft";
import { toast } from "@/lib/stores/toast-store";
import type { Branch, Settings } from "@/lib/types";
import { emptyLocalized } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { ImagePicker } from "@/components/ui/image-picker";
import { Input, Textarea } from "@/components/ui/input";
import { LocalizedTabs } from "@/components/ui/localized-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { useT } from "@/lib/i18n/use-t";
import { useFormLabels } from "@/lib/i18n/use-form-labels";

type Draft = Omit<Settings, "_id">;

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

export default function SettingsPage() {
  const t = useT();
  const f = useFormLabels();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get<Settings>("/settings")).data,
  });

  const [draft, setDraft] = useSyncedDraft<Draft>(Boolean(data), () =>
    data
      ? structuredClone({
          siteName: data.siteName,
          tagline: data.tagline,
          shortDescription: data.shortDescription,
          contact: data.contact,
          social: data.social,
          branches: data.branches,
          openingHours: data.openingHours,
          foundedYear: data.foundedYear,
          logo: data.logo,
          tradeLicense: data.tradeLicense,
        })
      : null,
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!draft) return;
      return api.put("/settings", draft);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success(t("toast.settingsSaved"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  if (isLoading || !draft) {
    return (
      <div className="flex h-60 items-center justify-center">
        <LoaderCircle className="size-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  const updateHour = (
    index: number,
    patch: Partial<Draft["openingHours"][number]>,
  ) =>
    setDraft({
      ...draft,
      openingHours: draft.openingHours.map((h, i) =>
        i === index ? { ...h, ...patch } : h,
      ),
    });

  const updateBranch = (index: number, patch: Partial<Branch>) =>
    setDraft({
      ...draft,
      branches: draft.branches.map((b, i) =>
        i === index ? { ...b, ...patch } : b,
      ),
    });

  return (
    <div>
      <PageHeader
        page="settings"
        actions={
          <Button
            loading={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            <Save className="size-4" />
            {t("common.save")}
          </Button>
        }
      />

      <div className="space-y-6">
        <Card title={t("pages.settings.website")}>
          <LocalizedTabs>
            {(lang) => (
              <div className="space-y-4">
                <FormField
                  label={`${t("pages.settings.siteName")} (${lang.toUpperCase()})`}
                >
                  <Input
                    dir={lang === "ar" ? "rtl" : undefined}
                    value={draft.siteName[lang]}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        siteName: { ...draft.siteName, [lang]: e.target.value },
                      })
                    }
                  />
                </FormField>
                <FormField
                  label={`${t("pages.settings.tagline")} (${lang.toUpperCase()})`}
                >
                  <Input
                    dir={lang === "ar" ? "rtl" : undefined}
                    value={draft.tagline[lang]}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        tagline: { ...draft.tagline, [lang]: e.target.value },
                      })
                    }
                  />
                </FormField>
                <FormField
                  label={`${f.shortDescription} (${lang.toUpperCase()})`}
                >
                  <Textarea
                    dir={lang === "ar" ? "rtl" : undefined}
                    value={draft.shortDescription[lang]}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        shortDescription: {
                          ...draft.shortDescription,
                          [lang]: e.target.value,
                        },
                      })
                    }
                  />
                </FormField>
              </div>
            )}
          </LocalizedTabs>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label={f.foundedYear}>
              <Input
                type="number"
                value={draft.foundedYear}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    foundedYear: Number(e.target.value) || 0,
                  })
                }
              />
            </FormField>
            <FormField label={f.tradeLicense}>
              <Input
                value={draft.tradeLicense}
                onChange={(e) =>
                  setDraft({ ...draft, tradeLicense: e.target.value })
                }
              />
            </FormField>
          </div>
          <div className="mt-4">
            <ImagePicker
              label={t("pages.settings.logo")}
              value={draft.logo}
              onChange={(logo) => setDraft({ ...draft, logo })}
            />
          </div>
        </Card>

        <Card title={t("pages.settings.contact")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={f.email}>
              <Input
                type="email"
                value={draft.contact.email}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    contact: { ...draft.contact, email: e.target.value },
                  })
                }
              />
            </FormField>
            <FormField label={f.phone}>
              <Input
                value={draft.contact.phone}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    contact: { ...draft.contact, phone: e.target.value },
                  })
                }
              />
            </FormField>
            <FormField label={f.phoneAlt}>
              <Input
                value={draft.contact.phoneAlt}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    contact: { ...draft.contact, phoneAlt: e.target.value },
                  })
                }
              />
            </FormField>
            <FormField label={f.whatsapp}>
              <Input
                value={draft.contact.whatsapp}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    contact: { ...draft.contact, whatsapp: e.target.value },
                  })
                }
              />
            </FormField>
          </div>
          <div className="mt-4">
            <LocalizedTabs>
              {(lang) => (
                <FormField label={`${f.headOffice} (${lang.toUpperCase()})`}>
                  <Input
                    dir={lang === "ar" ? "rtl" : undefined}
                    value={draft.contact.headOffice[lang]}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        contact: {
                          ...draft.contact,
                          headOffice: {
                            ...draft.contact.headOffice,
                            [lang]: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </FormField>
              )}
            </LocalizedTabs>
          </div>
        </Card>

        <Card title={t("pages.settings.social")}>
          <p className="mb-3 text-xs text-zinc-400">
            {t("pages.settings.socialHint")}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                "instagram",
                "facebook",
                "linkedin",
                "tiktok",
              ] as const
            ).map((key) => (
              <FormField key={key} label={key}>
                <Input
                  value={draft.social[key]}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      social: { ...draft.social, [key]: e.target.value },
                    })
                  }
                />
              </FormField>
            ))}
          </div>
        </Card>

        <Card title={t("pages.settings.branches")}>
          {draft.branches.map((branch, index) => (
            <div
              key={index}
              className="mb-4 rounded-lg border border-zinc-100 p-3"
            >
              <div className="mb-2 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      branches: draft.branches.filter((_, i) => i !== index),
                    })
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <LocalizedTabs>
                {(lang) => (
                  <div className="space-y-3">
                    <FormField label={`${f.city} (${lang.toUpperCase()})`}>
                      <Input
                        dir={lang === "ar" ? "rtl" : undefined}
                        value={branch.city[lang]}
                        onChange={(e) =>
                          updateBranch(index, {
                            city: { ...branch.city, [lang]: e.target.value },
                          })
                        }
                      />
                    </FormField>
                    <FormField label={`${f.address} (${lang.toUpperCase()})`}>
                      <Input
                        dir={lang === "ar" ? "rtl" : undefined}
                        value={branch.address[lang]}
                        onChange={(e) =>
                          updateBranch(index, {
                            address: {
                              ...branch.address,
                              [lang]: e.target.value,
                            },
                          })
                        }
                      />
                    </FormField>
                  </div>
                )}
              </LocalizedTabs>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <FormField label={f.phone}>
                  <Input
                    value={branch.phone}
                    onChange={(e) =>
                      updateBranch(index, { phone: e.target.value })
                    }
                  />
                </FormField>
                <FormField label={f.mapUrl}>
                  <Input
                    value={branch.mapUrl ?? ""}
                    onChange={(e) =>
                      updateBranch(index, { mapUrl: e.target.value })
                    }
                  />
                </FormField>
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
                branches: [
                  ...draft.branches,
                  {
                    city: emptyLocalized(),
                    address: emptyLocalized(),
                    phone: "",
                    mapUrl: "",
                    order: draft.branches.length,
                  },
                ],
              })
            }
          >
            <Plus className="size-3.5" />
            {t("pages.settings.addBranch")}
          </Button>
        </Card>

        <Card title={t("pages.settings.openingHours")}>
          <div className="space-y-3">
            {draft.openingHours.map((hour, index) => (
              <div
                key={index}
                className="grid items-center gap-3 rounded-lg border border-zinc-100 p-3 sm:grid-cols-[1fr_auto_auto_auto]"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-800">
                    {hour.day.en}
                  </p>
                  <p className="text-xs text-zinc-400" dir="rtl">
                    {hour.day.ar}
                  </p>
                </div>
                <Input
                  type="time"
                  className="w-28"
                  disabled={hour.closed}
                  value={hour.open}
                  onChange={(e) => updateHour(index, { open: e.target.value })}
                />
                <Input
                  type="time"
                  className="w-28"
                  disabled={hour.closed}
                  value={hour.close}
                  onChange={(e) =>
                    updateHour(index, { close: e.target.value })
                  }
                />
                <label className="flex items-center gap-2 text-xs text-zinc-600">
                  <Switch
                    checked={!hour.closed}
                    onChange={(v) => updateHour(index, { closed: !v })}
                    label={f.opened}
                    size="sm"
                  />
                  {hour.closed ? t("common.closed") : f.opened}
                </label>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
