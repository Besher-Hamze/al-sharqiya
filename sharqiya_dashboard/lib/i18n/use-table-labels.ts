"use client";

import { useT } from "./use-t";

export function useTableLabels() {
  const t = useT();
  return {
    name: t("table.name"),
    title: t("table.title"),
    slug: t("table.slug"),
    order: t("table.order"),
    published: t("table.published"),
    email: t("table.email"),
    role: t("table.role"),
    status: t("table.status"),
    service: t("table.service"),
    date: t("table.date"),
    rating: t("table.rating"),
    subject: t("table.subject"),
    sender: t("table.sender"),
    received: t("table.received"),
    contact: t("table.contact"),
    user: t("table.user"),
    created: t("table.created"),
    active: t("table.active"),
    timestamp: t("table.timestamp"),
    action: t("table.action"),
    resource: t("table.resource"),
    path: t("table.path"),
    question: t("table.question"),
    client: t("table.client"),
    location: t("table.location"),
    featured: t("table.featured"),
    company: t("table.company"),
    edit: t("common.edit"),
    delete: t("common.delete"),
    method: t("table.method"),
  };
}
