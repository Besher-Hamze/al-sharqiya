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
import { PUBLIC_API_URL } from "@/lib/utils";

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const schema = z.object({
    name: z
      .string()
      .min(1, t("validation.nameRequired"))
      .min(2, t("validation.nameShort")),
    email: z.string().email(t("validation.emailInvalid")),
    phone: z.string().optional(),
    subject: z.string().min(1, t("validation.subjectRequired")),
    message: z
      .string()
      .min(1, t("validation.messageRequired"))
      .min(10, t("validation.messageShort")),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.post(`${PUBLIC_API_URL}/api/v1/contact`, {
        ...values,
        phone: values.phone || undefined,
        locale,
      });
      setStatus("success");
      reset();
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
        <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-ink-500">
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
      <p className="mt-1.5 text-sm text-ink-500">{t("formSubtitle")}</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label={t("fields.name")} htmlFor="name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={inputClass}
            {...register("name")}
          />
        </Field>

        <Field
          label={t("fields.email")}
          htmlFor="email"
          error={errors.email?.message}
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            className={inputClass}
            {...register("email")}
          />
        </Field>

        <Field label={t("fields.phone")} htmlFor="phone">
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            dir="ltr"
            className={inputClass}
            {...register("phone")}
          />
        </Field>

        <Field
          label={t("fields.subject")}
          htmlFor="subject"
          error={errors.subject?.message}
        >
          <input
            id="subject"
            type="text"
            className={inputClass}
            {...register("subject")}
          />
        </Field>

        <Field
          label={t("fields.message")}
          htmlFor="message"
          error={errors.message?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="message"
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
