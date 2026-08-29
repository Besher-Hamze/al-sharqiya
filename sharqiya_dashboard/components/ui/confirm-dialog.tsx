"use client";

import { TriangleAlert } from "lucide-react";
import { useT } from "@/lib/i18n/use-t";
import { Button } from "./button";
import { Modal } from "./modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  loading,
}: ConfirmDialogProps) {
  const t = useT();

  return (
    <Modal open={open} onClose={onClose} widthClass="max-w-sm">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-red-50">
          <TriangleAlert className="size-5 text-red-500" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">
          {title ?? t("common.confirmDeleteTitle")}
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          {message ?? t("common.confirmDeleteMessage")}
        </p>
        <div className="mt-5 flex w-full gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel ?? t("common.delete")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
