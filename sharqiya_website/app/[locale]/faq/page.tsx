import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getFaqs, getSettings } from "@/lib/api";
import { loc } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.faq" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/faq`,
      languages: { en: "/en/faq", ar: "/ar/faq" },
    },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [faqs, settings, t] = await Promise.all([
    getFaqs(),
    getSettings(),
    getTranslations("faq"),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: loc(faq.question, locale),
      acceptedAnswer: {
        "@type": "Answer",
        text: loc(faq.answer, locale),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={loc(settings.tagline, locale)}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <FaqAccordion faqs={faqs} />

        <Reveal className="mt-14 rounded-2xl bg-graphite-950 p-8 text-center shadow-lift sm:p-10">
          <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
            {t("stillAsking")}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-graphite-300">
            {t("stillAskingBody")}
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-7 text-sm font-semibold text-graphite-950 transition hover:shadow-glow"
          >
            {t("stillAskingButton")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
