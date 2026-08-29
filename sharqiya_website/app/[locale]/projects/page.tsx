import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects, getServices, getSettings, mediaUrl } from "@/lib/api";
import { loc } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { ProjectFilter } from "@/components/sections/project-filter";
import { CtaBand } from "@/components/sections/cta-band";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.projects" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/projects`,
      languages: { en: "/en/projects", ar: "/ar/projects" },
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [projects, services, settings, t] = await Promise.all([
    getProjects(),
    getServices(),
    getSettings(),
    getTranslations("projects"),
  ]);

  const featuredCover = projects.find((p) => p.isFeatured)?.coverImage;

  return (
    <>
      <PageHero
        eyebrow={loc(settings.tagline, locale)}
        title={t("title")}
        subtitle={t("subtitle")}
        image={featuredCover ? mediaUrl(featuredCover) : undefined}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <ProjectFilter
          projects={projects}
          services={services.map((service) => ({
            slug: service.slug,
            label: loc(service.name, locale),
          }))}
        />
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
