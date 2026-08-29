"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { api, apiErrorMessage } from "@/lib/api";
import { isSuperadmin, useAuthStore } from "@/lib/stores/auth-store";
import { toast } from "@/lib/stores/toast-store";
import type { DashboardUser, Paginated, UserRole } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, type Column } from "@/components/ui/data-table";
import { FormField } from "@/components/ui/form-field";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { useFormLabels } from "@/lib/i18n/use-form-labels";
import { useTableLabels } from "@/lib/i18n/use-table-labels";
import { useDashboardLocale, useT } from "@/lib/i18n/use-t";

const roleBadge: Record<UserRole, string> = {
  superadmin: "border-brand-300 bg-brand-50 text-brand-800",
  admin: "border-brand-200 bg-brand-50 text-brand-700",
  editor: "border-zinc-200 bg-zinc-50 text-zinc-600",
};

const userSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string(),
  role: z.enum(["superadmin", "admin", "editor"]),
  isActive: z.boolean(),
});

type UserValues = z.infer<typeof userSchema>;

export default function UsersPage() {
  const t = useT();
  const tbl = useTableLabels();
  const f = useFormLabels();
  const { locale } = useDashboardLocale();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const canEdit = isSuperadmin(currentUser?.role);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DashboardUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DashboardUser | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users", "list", page],
    queryFn: async () =>
      (
        await api.get<Paginated<DashboardUser>>("/users", {
          params: { page, limit: 20 },
        })
      ).data,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["users"] });

  const form = useForm<UserValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "editor",
      isActive: true,
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({
      name: "",
      email: "",
      password: "",
      role: "editor",
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (row: DashboardUser) => {
    setEditing(row);
    form.reset({
      name: row.name,
      email: row.email,
      password: "",
      role: row.role,
      isActive: row.isActive,
    });
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: UserValues) => {
      const payload = {
        name: values.name,
        email: values.email,
        role: values.role,
        isActive: values.isActive,
        ...(values.password ? { password: values.password } : {}),
      };
      if (editing) return api.patch(`/users/${editing._id}`, payload);
      if (!values.password || values.password.length < 8) {
        throw new Error(t("pages.users.passwordMinLength"));
      }
      return api.post("/users", { ...payload, password: values.password });
    },
    onSuccess: () => {
      invalidate();
      setModalOpen(false);
      toast.success(
        editing ? t("toast.userUpdated") : t("toast.userCreated"),
      );
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
      toast.success(t("toast.userDeleted"));
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const columns: Column<DashboardUser>[] = [
    {
      key: "name",
      header: tbl.name,
      render: (u) => (
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full brand-gradient text-xs font-semibold text-white">
            {u.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-medium text-zinc-900">
              {u.name}
              {u._id === currentUser?.id ? (
                <span className="ms-1 text-xs text-zinc-400">
                  {t("common.you")}
                </span>
              ) : null}
            </p>
            <p className="text-xs text-zinc-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: tbl.role,
      render: (u) => (
        <Badge className={roleBadge[u.role]}>
          {u.role === "superadmin" && <ShieldCheck className="size-3" />}
          {t(`roles.${u.role}`)}
        </Badge>
      ),
    },
    {
      key: "active",
      header: tbl.active,
      render: (u) => (
        <span
          className={
            u.isActive ? "text-xs text-emerald-600" : "text-xs text-zinc-400"
          }
        >
          {u.isActive ? tbl.active : "–"}
        </span>
      ),
    },
    {
      key: "created",
      header: tbl.created,
      className: "hidden md:table-cell",
      render: (u) => (
        <span className="text-xs text-zinc-400">
          {formatDate(u.createdAt, locale)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20 text-end",
      render: (u) =>
        canEdit ? (
          <div className="flex justify-end gap-0.5">
            <button
              onClick={() => openEdit(u)}
              className="cursor-pointer rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              aria-label={tbl.edit}
            >
              <Pencil className="size-4" />
            </button>
            <button
              onClick={() => setDeleteTarget(u)}
              className="cursor-pointer rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
              aria-label={tbl.delete}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ) : null,
    },
  ];

  const errors = form.formState.errors;

  return (
    <div>
      <PageHeader
        page="users"
        actions={
          canEdit ? (
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              {t("pages.users.create")}
            </Button>
          ) : undefined
        }
      />

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        rowKey={(u) => u._id}
        loading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t("pages.users.edit") : t("pages.users.create")}
      >
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))}
          noValidate
        >
          <FormField label={tbl.name} error={errors.name?.message} required>
            <Input {...form.register("name")} />
          </FormField>
          <FormField label={tbl.email} error={errors.email?.message} required>
            <Input type="email" {...form.register("email")} />
          </FormField>
          <FormField
            label={f.password}
            hint={editing ? f.passwordHint : t("pages.users.passwordMinHint")}
            required={!editing}
          >
            <Input type="password" {...form.register("password")} />
          </FormField>
          <FormField label={tbl.role}>
            <Select {...form.register("role")}>
              <option value="editor">{t("roles.editor")}</option>
              <option value="admin">{t("roles.admin")}</option>
              <option value="superadmin">{t("roles.superadmin")}</option>
            </Select>
          </FormField>
          <Controller
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <label className="flex items-center gap-2.5 text-sm text-zinc-700">
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  label={tbl.active}
                />
                {tbl.active}
              </label>
            )}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" loading={saveMutation.isPending}>
              {t("common.save")}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate(deleteTarget._id)
        }
        title={t("pages.users.deleteTitle")}
        message={t("pages.users.deleteMessage", {
          name: deleteTarget?.name ?? "",
          email: deleteTarget?.email ?? "",
        })}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
