"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Save } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { useSyncedDraft } from "@/lib/use-synced-draft";
import { toast } from "@/lib/stores/toast-store";
import type { NavItem, Navigation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { useT } from "@/lib/i18n/use-t";
import { useFormLabels } from "@/lib/i18n/use-form-labels";

type MenuKey = "headerMenu" | "footerMenu" | "legalMenu";

export default function NavigationPage() {
  const t = useT();
  const f = useFormLabels();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["navigation"],
    queryFn: async () => (await api.get<Navigation>("/navigation")).data,
  });

  const [draft, setDraft] = useSyncedDraft<Navigation>(Boolean(data), () =>
    data
      ? structuredClone({
          headerMenu: data.headerMenu ?? [],
          footerMenu: data.footerMenu ?? [],
          legalMenu: data.legalMenu ?? [],
        })
      : null,
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!draft) return;
      return api.put("/navigation", draft);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation"] });
      toast.success(t("toast.navigationSaved"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const updateItem = (
    menu: MenuKey,
    index: number,
    patch: Partial<NavItem>,
  ) => {
    if (!draft) return;
    setDraft({
      ...draft,
      [menu]: draft[menu].map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    });
  };

  if (isLoading || !draft) {
    return (
      <div className="flex h-60 items-center justify-center">
        <LoaderCircle className="size-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  const renderMenu = (menu: MenuKey, title: string) => (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
      <div className="mt-4 space-y-4">
        {draft[menu].map((item, index) => (
          <div
            key={`${item.key}-${index}`}
            className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <code className="text-xs text-zinc-400">{item.key}</code>
              <label className="flex items-center gap-2 text-xs text-zinc-600">
                <Switch
                  checked={!item.hidden}
                  onChange={(v) => updateItem(menu, index, { hidden: !v })}
                  label={f.visible}
                  size="sm"
                />
                {f.visible}
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Label EN">
                <Input
                  value={item.label.en}
                  onChange={(e) =>
                    updateItem(menu, index, {
                      label: { ...item.label, en: e.target.value },
                    })
                  }
                />
              </FormField>
              <FormField label="Label AR">
                <Input
                  dir="rtl"
                  value={item.label.ar}
                  onChange={(e) =>
                    updateItem(menu, index, {
                      label: { ...item.label, ar: e.target.value },
                    })
                  }
                />
              </FormField>
              <FormField label={f.linkHref} className="sm:col-span-2">
                <Input
                  value={item.href}
                  onChange={(e) =>
                    updateItem(menu, index, { href: e.target.value })
                  }
                />
              </FormField>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        page="navigation"
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
        {renderMenu("headerMenu", t("pages.navigation.headerMenu"))}
        {renderMenu("footerMenu", t("pages.navigation.footerMenu"))}
        {renderMenu("legalMenu", t("pages.navigation.legalMenu"))}
      </div>
    </div>
  );
}
