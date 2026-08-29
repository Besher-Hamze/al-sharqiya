import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getServices, getSettings, mediaUrl } from "@/lib/api";
import { loc } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { ServiceCard } from "@/components/sections/service-card";
import { CtaBand } from "@/components/sections/cta-band";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.services" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/services`,
      languages: { en: "/en/services", ar: "/ar/services" },
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [services, settings, t, th] = await Promise.all([
    getServices(),
    getSettings(),
    getTranslations("services"),
    getTranslations("home"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={loc(settings.tagline, locale)}
        title={t("title")}
        subtitle={t("subtitle")}
        image={services[0] ? mediaUrl(services[0].coverImage) : undefined}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.slug}>
              <ServiceCard
                service={service}
                locale={locale}
                cta={th("learnMore")}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaBand
        heading={t("ctaTitle")}
        body={t("ctaBody")}
        primaryCta={t("ctaButton")}
        phone={settings.contact.phone}
      />
    </>
  );
}
