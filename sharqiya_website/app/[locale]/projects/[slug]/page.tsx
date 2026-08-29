import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getProject,
  getProjects,
  getService,
  getSettings,
  mediaUrl,
} from "@/lib/api";
import { byOrder, loc } from "@/lib/utils";
import { routing } from "@/i18n/routing";
import { PageHero } from "@/components/ui/page-hero";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Prose } from "@/components/sections/prose";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { ProjectCard } from "@/components/sections/project-card";
import { Pager } from "@/components/sections/pager";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  const title = loc(project.seo?.title, locale) || loc(project.title, locale);
  const description =
    loc(project.seo?.description, locale) || loc(project.excerpt, locale);

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: {
        en: `/en/projects/${slug}`,
        ar: `/ar/projects/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [{ url: mediaUrl(project.seo?.ogImage || project.coverImage) }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getProject(slug);
  if (!project) notFound();

  const [projects, service, settings, t, tn, ts] = await Promise.all([
    getProjects(),
    project.serviceSlug ? getService(project.serviceSlug) : null,
    getSettings(),
    getTranslations("projects"),
    getTranslations("nav"),
    getTranslations("services"),
  ]);

  const ordered = byOrder(projects);
  const index = ordered.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? ordered[index - 1] : undefined;
  const next = index < ordered.length - 1 ? ordered[index + 1] : undefined;

  const related = projects
    .filter((p) => p.slug !== slug && p.serviceSlug === project.serviceSlug)
    .slice(0, 3);

  const facts = [
    { label: t("client"), value: loc(project.client, locale) },
    { label: t("location"), value: loc(project.location, locale) },
    { label: t("area"), value: project.area },
    { label: t("service"), value: service ? loc(service.name, locale) : "" },
  ].filter((fact) => fact.value);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: loc(project.title, locale),
    description: loc(project.description, locale),
    image: mediaUrl(project.coverImage),
    locationCreated: {
      "@type": "Place",
      name: loc(project.location, locale),
      address: { "@type": "PostalAddress", addressCountry: "AE" },
    },
    creator: {
      "@type": "GeneralContractor",
      name: loc(settings.siteName, locale),
      telephone: settings.contact.phone,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={service ? loc(service.name, locale) : undefined}
        title={loc(project.title, locale)}
        subtitle={loc(project.excerpt, locale)}
        image={mediaUrl(project.coverImage)}
        imageAlt={loc(project.title, locale)}
      >
        <Breadcrumbs
          items={[
            { label: tn("home"), href: "/" },
            { label: tn("projects"), href: "/projects" },
            { label: loc(project.title, locale) },
          ]}
        />
      </PageHero>

      {/* Fact strip */}
      {facts.length > 0 ? (
        <section className="border-b border-ink-200 bg-white">
          <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-ink-200 px-0 sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-white px-5 py-6 sm:px-6">
                <dt className="tracking-brand text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-graphite-900">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* Description and scope */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          <Reveal className="lg:col-span-2">
            <Prose
              text={loc(project.description, locale)}
              className="text-base sm:text-[17px]"
            />
          </Reveal>

          {project.scope.length > 0 ? (
            <Reveal delay={0.1}>
              <div className="rounded-2xl bg-graphite-950 p-6 text-white shadow-lift">
                <h2 className="tracking-brand text-[11px] font-bold uppercase tracking-[0.22em] text-gold-400">
                  {t("scopeTitle")}
                </h2>
                <ul className="mt-5 space-y-3">
                  {project.scope.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-300">
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      <span className="text-sm leading-relaxed text-graphite-200">
                        {loc(item, locale)}
                      </span>
                    </li>
                  ))}
                </ul>

                {service ? (
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-300 transition hover:text-gold-200"
                  >
                    {ts("viewService")}
                    <ArrowRight
                      className="h-4 w-4 rtl:rotate-180"
                      aria-hidden
                    />
                  </Link>
                ) : null}
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* Gallery */}
      {project.gallery.length > 0 ? (
        <section className="section-mesh-bone py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-graphite-950 sm:text-3xl">
              {t("galleryTitle")}
            </h2>
            <div className="mt-8">
              <GalleryGrid images={project.gallery} columns={2} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Related + pager */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {related.length > 0 ? (
          <>
            <h2 className="font-display text-2xl font-semibold text-graphite-950 sm:text-3xl">
              {t("relatedTitle")}
            </h2>
            <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <StaggerItem key={item.slug}>
                  <ProjectCard project={item} locale={locale} />
                </StaggerItem>
              ))}
            </Stagger>
          </>
        ) : null}

        <div className="mt-14">
          <Pager
            prev={
              prev
                ? {
                    href: `/projects/${prev.slug}`,
                    title: loc(prev.title, locale),
                  }
                : undefined
            }
            next={
              next
                ? {
                    href: `/projects/${next.slug}`,
                    title: loc(next.title, locale),
                  }
                : undefined
            }
            prevLabel={ts("prev")}
            nextLabel={ts("next")}
          />
        </div>
      </section>

      <CtaBand
        heading={t("ctaTitle")}
        body={t("ctaBody")}
        primaryCta={t("ctaButton")}
        phone={settings.contact.phone}
        image={mediaUrl(project.coverImage)}
      />
    </>
  );
}
