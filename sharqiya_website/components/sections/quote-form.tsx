"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { CheckCircle2, CircleAlert, Send } from "lucide-react";
import { Field, inputClass } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn, PUBLIC_API_URL } from "@/lib/utils";

const PROPERTY_TYPES = [
  "residential",
  "commercial",
  "industrial",
  "government",
  "other",
] as const;

const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
  "Al Ain",
] as const;

export function QuoteForm({
  services,
  /** Pre-selects a service when arriving from a service page. */
  defaultService,
}: {
  services: { slug: string; label: string }[];
  defaultService?: string;
}) {
  const t = useTranslations("quote");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [selected, setSelected] = useState<string[]>(
    defaultService ? [defaultService] : [],
  );

  const schema = z.object({
    name: z
      .string()
      .min(1, t("validation.nameRequired"))
      .min(2, t("validation.nameShort")),
    phone: z
      .string()
      .min(1, t("validation.phoneRequired"))
      .min(6, t("validation.phoneShort")),
    email: z
      .union([z.string().email(t("validation.emailInvalid")), z.literal("")])
      .optional(),
    company: z.string().optional(),
    propertyType: z.enum(PROPERTY_TYPES),
    emirate: z.string().optional(),
    area: z.string().optional(),
    message: z.string().optional(),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { propertyType: "commercial" },
  });

  const toggleService = (slug: string) =>
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.post(`${PUBLIC_API_URL}/api/v1/quotes`, {
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        company: values.company || undefined,
        services: selected,
        propertyType: values.propertyType,
        emirate: values.emirate || undefined,
        area: values.area || undefined,
        message: values.message || undefined,
        locale,
      });
      setStatus("success");
      reset();
      setSelected(defaultService ? [defaultService] : []);
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-white p-10 text-center shadow-soft ring-1 ring-ink-200/70">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold text-graphite-950">
          {t("successTitle")}
        </h3>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-ink-500">
          {t("successBody")}
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          {t("sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink-200/70 sm:p-8"
    >
      <h3 className="font-display text-xl font-semibold text-graphite-950">
        {t("formTitle")}
      </h3>

      {/* Service multi-select, rendered as toggle chips */}
      <fieldset className="mt-7">
        <legend className="text-sm font-medium text-graphite-800">
          {t("servicesLabel")}
        </legend>
        <p className="mt-1 text-xs text-ink-400">{t("servicesHint")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((service) => {
            const on = selected.includes(service.slug);
            return (
              <button
                key={service.slug}
                type="button"
                aria-pressed={on}
                onClick={() => toggleService(service.slug)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  on
                    ? "bg-gold-500 text-graphite-950 shadow-soft"
                    : "bg-ink-100 text-graphite-700 hover:bg-gold-100",
                )}
              >
                {service.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field
          label={t("fields.name")}
          htmlFor="q-name"
          error={errors.name?.message}
        >
          <input
            id="q-name"
            type="text"
            autoComplete="name"
            className={inputClass}
            {...register("name")}
          />
        </Field>

        <Field
          label={t("fields.phone")}
          htmlFor="q-phone"
          error={errors.phone?.message}
        >
          <input
            id="q-phone"
            type="tel"
            autoComplete="tel"
            dir="ltr"
            className={inputClass}
            {...register("phone")}
          />
        </Field>

        <Field
          label={t("fields.email")}
          htmlFor="q-email"
          optional={t("optional")}
          error={errors.email?.message}
        >
          <input
            id="q-email"
            type="email"
            autoComplete="email"
            dir="ltr"
            className={inputClass}
            {...register("email")}
          />
        </Field>

        <Field
          label={t("fields.company")}
          htmlFor="q-company"
          optional={t("optional")}
        >
          <input
            id="q-company"
            type="text"
            autoComplete="organization"
            className={inputClass}
            {...register("company")}
          />
        </Field>

        <Field label={t("fields.propertyType")} htmlFor="q-property">
          <select
            id="q-property"
            className={inputClass}
            {...register("propertyType")}
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`propertyTypes.${type}`)}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={t("fields.emirate")}
          htmlFor="q-emirate"
          optional={t("optional")}
        >
          <select id="q-emirate" className={inputClass} {...register("emirate")}>
            <option value="">—</option>
            {EMIRATES.map((emirate) => (
              <option key={emirate} value={emirate}>
                {emirate}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={t("fields.area")}
          htmlFor="q-area"
          optional={t("optional")}
          className="sm:col-span-2"
        >
          <input
            id="q-area"
            type="text"
            placeholder={t("fields.areaPlaceholder")}
            className={inputClass}
            {...register("area")}
          />
        </Field>

        <Field
          label={t("fields.message")}
          htmlFor="q-message"
          optional={t("optional")}
          className="sm:col-span-2"
        >
          <textarea
            id="q-message"
            rows={5}
            placeholder={t("fields.messagePlaceholder")}
            className={`${inputClass} resize-y`}
            {...register("message")}
          />
        </Field>
      </div>

      {status === "error" ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 rounded-xl bg-error/8 px-4 py-3 text-sm text-error"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {t("errorBody")}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-7 w-full sm:w-auto"
      >
        <Send className="h-4 w-4" aria-hidden />
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
