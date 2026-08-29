import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getProjects,
  getService,
  getServices,
  getSettings,
  mediaUrl,
} from "@/lib/api";
import { byOrder, loc } from "@/lib/utils";
import { routing } from "@/i18n/routing";
import { PageHero } from "@/components/ui/page-hero";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Prose } from "@/components/sections/prose";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { ProjectCard } from "@/components/sections/project-card";
import { Pager } from "@/components/sections/pager";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export const revalidate = 60;

export async function generateStaticParams() {
  const services = await getServices();
  return routing.locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getService(slug);
  if (!service) return {};

  const title = loc(service.seo?.title, locale) || loc(service.name, locale);
  const description =
    loc(service.seo?.description, locale) || loc(service.excerpt, locale);

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/services/${slug}`,
      languages: {
        en: `/en/services/${slug}`,
        ar: `/ar/services/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [{ url: mediaUrl(service.seo?.ogImage || service.coverImage) }],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [service, services, projects, settings, t, tn, tp] = await Promise.all([
    getService(slug),
    getServices(),
    getProjects(),
    getSettings(),
    getTranslations("services"),
    getTranslations("nav"),
    getTranslations("projects"),
  ]);

  if (!service) notFound();

  const ordered = byOrder(services);
  const index = ordered.findIndex((s) => s.slug === slug);
  const prev = index > 0 ? ordered[index - 1] : undefined;
  const next = index < ordered.length - 1 ? ordered[index + 1] : undefined;

  const related = projects.filter((p) => p.serviceSlug === slug).slice(0, 3);
  const others = ordered.filter((s) => s.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: loc(service.name, locale),
    description: loc(service.description, locale),
    serviceType: loc(service.name, locale),
    provider: {
      "@type": "GeneralContractor",
      name: loc(settings.siteName, locale),
      telephone: settings.contact.phone,
      email: settings.contact.email,
    },
    areaServed: settings.branches.map((branch) => loc(branch.city, locale)),
    image: mediaUrl(service.coverImage),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={loc(settings.tagline, locale)}
        title={loc(service.name, locale)}
        subtitle={loc(service.excerpt, locale)}
        image={mediaUrl(service.coverImage)}
        imageAlt={loc(service.name, locale)}
      >
        <Breadcrumbs
          items={[
            { label: tn("home"), href: "/" },
            { label: tn("services"), href: "/services" },
            { label: loc(service.name, locale) },
          ]}
        />
      </PageHero>

      {/* Description with a sticky spec panel */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            <Reveal>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500 text-graphite-950 shadow-soft">
                <DynamicIcon name={service.icon} className="h-6 w-6" />
              </span>
              <Prose
                text={loc(service.description, locale)}
                className="mt-7 text-base sm:text-[17px]"
              />
            </Reveal>

            {service.features.length > 0 ? (
              <Reveal className="mt-12">
                <h2 className="font-display text-2xl font-semibold text-graphite-950">
                  {t("featuresTitle")}
                </h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-soft ring-1 ring-ink-200/70"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      <span className="text-sm leading-relaxed text-ink-600">
                        {loc(feature, locale)}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          {service.specs.length > 0 ? (
            <Reveal delay={0.1}>
              <div className="sticky top-24 rounded-2xl bg-graphite-950 p-6 text-white shadow-lift">
                <h2 className="tracking-brand text-[11px] font-bold uppercase tracking-[0.22em] text-gold-400">
                  {t("specsTitle")}
                </h2>
                <dl className="mt-5 divide-y divide-white/10">
                  {service.specs.map((spec, i) => (
                    <div key={i} className="py-3.5 first:pt-0 last:pb-0">
                      <dt className="text-xs text-graphite-400">
                        {loc(spec.label, locale)}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-white">
                        {loc(spec.value, locale)}
                      </dd>
                    </div>
                  ))}
                </dl>

                <Link
                  href="/quote"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 text-sm font-semibold text-graphite-950 transition hover:shadow-glow"
                >
                  {t("ctaButton")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </Link>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* Editorial sections, alternating image side */}
      {service.sections.length > 0 ? (
        <section className="section-mesh-bone py-20">
          <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8 lg:space-y-24">
            {service.sections.map((section, i) => {
              const image = section.images?.[0];
              return (
                <div
                  key={i}
                  className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                >
                  <Reveal className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <h2 className="font-display text-2xl font-semibold text-graphite-950 sm:text-3xl">
                      {loc(section.heading, locale)}
                    </h2>
                    <Prose
                      text={loc(section.body, locale)}
                      className="mt-5 text-base"
                    />
                  </Reveal>

                  {image ? (
                    <Reveal
                      delay={0.1}
                      className={`editorial-frame aspect-4/3 ${i % 2 === 1 ? "lg:order-1" : ""}`}
                    >
                      <Image
                        src={mediaUrl(image.src)}
                        alt={loc(image.alt, locale)}
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </Reveal>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Gallery */}
      {service.gallery.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-graphite-950 sm:text-3xl">
            {t("galleryTitle")}
          </h2>
          <div className="mt-8">
            <GalleryGrid images={service.gallery} />
          </div>
        </section>
      ) : null}

      {/* Related projects */}
      {related.length > 0 ? (
        <section className="section-mesh-bone py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-graphite-950 sm:text-3xl">
              {t("relatedProjectsTitle")}
            </h2>
            <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((project) => (
                <StaggerItem key={project.slug}>
                  <ProjectCard project={project} locale={locale} />
                </StaggerItem>
              ))}
            </Stagger>
            <Link
              href="/projects"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition hover:text-gold-800"
            >
              {tp("filterAll")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </section>
      ) : null}

      {/* Other services + pager */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-graphite-950 sm:text-3xl">
          {t("otherServicesTitle")}
        </h2>
        <Stagger className="mt-8 grid gap-4 sm:grid-cols-3">
          {others.map((other) => (
            <StaggerItem key={other.slug}>
              <Link
                href={`/services/${other.slug}`}
                className="group flex h-full items-center gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-200/70 transition hover:ring-gold-400"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700 transition group-hover:bg-gold-500 group-hover:text-graphite-950">
                  <DynamicIcon name={other.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-semibold text-graphite-950">
                    {loc(other.name, locale)}
                  </span>
                  <span className="mt-0.5 block line-clamp-2 text-xs text-ink-400">
                    {loc(other.excerpt, locale)}
                  </span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-14">
          <Pager
            prev={
              prev
                ? {
                    href: `/services/${prev.slug}`,
                    title: loc(prev.name, locale),
                  }
                : undefined
            }
            next={
              next
                ? {
                    href: `/services/${next.slug}`,
                    title: loc(next.name, locale),
                  }
                : undefined
            }
            prevLabel={t("prev")}
            nextLabel={t("next")}
          />
        </div>
      </section>

      <CtaBand
        heading={t("ctaTitle")}
        body={t("ctaBody")}
        primaryCta={t("ctaButton")}
        phone={settings.contact.phone}
        image={mediaUrl(service.coverImage)}
      />
    </>
  );
}
