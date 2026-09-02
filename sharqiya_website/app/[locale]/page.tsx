import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getFaqs,
  getGallery,
  getHomepage,
  getProjects,
  getServices,
  getSettings,
  mediaUrl,
} from "@/lib/api";
import { loc } from "@/lib/utils";
import { Hero } from "@/components/sections/hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/sections/service-card";
import { ProjectCard } from "@/components/sections/project-card";
import { ValueGrid } from "@/components/sections/value-grid";
import { ProcessSteps } from "@/components/sections/process-steps";
import { ClientMarquee } from "@/components/sections/client-marquee";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [home, services, projects, albums, faqs, settings, t, tg] =
    await Promise.all([
      getHomepage(),
      getServices(),
      getProjects(),
      getGallery(),
      getFaqs(),
      getSettings(),
      getTranslations("home"),
      getTranslations("gallery"),
    ]);

  const featured = projects.filter((p) => p.isFeatured).slice(0, 5);
  const gridProjects = featured.length >= 3 ? featured : projects.slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: loc(settings.siteName, locale),
    description: loc(settings.shortDescription, locale),
    foundingDate: String(settings.foundedYear),
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/${locale}`,
    email: settings.contact.email,
    telephone: settings.contact.phone,
    image: mediaUrl(settings.logo),
    address: settings.branches.map((branch) => ({
      "@type": "PostalAddress",
      addressLocality: loc(branch.city, locale),
      addressCountry: "AE",
      streetAddress: loc(branch.address, locale),
    })),
    areaServed: settings.branches.map((branch) => loc(branch.city, locale)),
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: loc(service.name, locale),
        description: loc(service.excerpt, locale),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero
        eyebrow={loc(home.hero.eyebrow, locale)}
        titleLine1={loc(home.hero.titleLine1, locale)}
        titleLine2={loc(home.hero.titleLine2, locale)}
        subtitle={loc(home.hero.subtitle, locale)}
        primaryCta={loc(home.hero.primaryCta, locale)}
        secondaryCta={loc(home.hero.secondaryCta, locale)}
        slides={home.hero.slides.map((slide) => mediaUrl(slide))}
        phone={settings.contact.phone}
      />

      {/* Intro — company statement beside a portrait image */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span
              className="block h-px w-16 bg-gradient-to-r from-gold-500 to-transparent"
              aria-hidden
            />
            <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.14] text-graphite-950 sm:text-4xl lg:text-[2.6rem]">
              {loc(home.intro.heading, locale)}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-500 sm:text-lg">
              {loc(home.intro.body, locale)}
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition hover:text-gold-800"
            >
              {t("learnMore")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </Reveal>

          <Reveal delay={0.12} className="editorial-frame aspect-4/5 lg:aspect-4/5">
            <Image
              src={mediaUrl(home.cta.image)}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section-mesh-bone py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("servicesEyebrow")}
            title={t("servicesTitle")}
            subtitle={t("servicesSubtitle")}
          />

          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <StaggerItem key={service.slug}>
                <ServiceCard
                  service={service}
                  locale={locale}
                  cta={t("learnMore")}
                />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-graphite-900 px-7 text-sm font-semibold text-white shadow-lift transition hover:bg-graphite-800"
            >
              {t("servicesCta")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured projects — first card spans two rows for an editorial rhythm */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("projectsEyebrow")}
            title={t("projectsTitle")}
            subtitle={t("projectsSubtitle")}
          />

          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gridProjects.map((project, i) => (
              <StaggerItem
                key={project.slug}
                className={i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}
              >
                <ProjectCard
                  project={project}
                  locale={locale}
                  variant={i === 0 ? "feature" : "default"}
                />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-graphite-900 px-7 text-sm font-semibold text-white shadow-lift transition hover:bg-graphite-800"
            >
              {t("projectsCta")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Values, on a dark panel to break up the page */}
      <section className="section-dark noise-overlay relative overflow-hidden py-20 lg:py-28">
        <div
          className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("valuesEyebrow")}
            title={t("valuesTitle")}
            light
          />
          <div className="mt-14">
            <ValueGrid
              values={home.values.map((value) => ({
                icon: value.icon,
                title: loc(value.title, locale),
                body: loc(value.body, locale),
              }))}
            />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("processEyebrow")}
            title={t("processTitle")}
            subtitle={t("processSubtitle")}
          />
          <div className="mt-14">
            <ProcessSteps
              steps={home.process.map((step) => ({
                title: loc(step.title, locale),
                body: loc(step.body, locale),
              }))}
              stepLabel={(n) => t("processStep", { number: n })}
            />
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="section-mesh-bone py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ClientMarquee
            heading={loc(home.clients.heading, locale)}
            note={loc(home.clients.note, locale)}
            items={home.clients.items.map((item) => loc(item, locale))}
          />
        </div>
      </section>

      {/* Gallery teaser */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("galleryEyebrow")}
            title={t("galleryTitle")}
          />

          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {albums.map((album) => (
              <StaggerItem key={album.slug}>
                <Link
                  href={`/gallery#${album.slug}`}
                  className="group relative block aspect-3/4 overflow-hidden rounded-2xl bg-graphite-950 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <Image
                    src={mediaUrl(album.coverImage)}
                    alt={loc(album.title, locale)}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-graphite-950/30 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-base font-semibold text-white">
                      {loc(album.title, locale)}
                    </h3>
                    <p className="mt-1 text-xs text-gold-300">
                      {tg("photoCount", { count: album.images.length })}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12 text-center">
            <Link
              href="/gallery"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-gold-400/70 px-7 text-sm font-semibold text-gold-700 transition hover:bg-gold-50"
            >
              {t("galleryCta")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-mesh-bone py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={t("faqEyebrow")} title={t("faqTitle")} />
          <div className="mt-12">
            <FaqAccordion faqs={faqs.slice(0, 5)} />
          </div>
          <Reveal className="mt-10 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition hover:text-gold-800"
            >
              {t("faqCta")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand
        heading={loc(home.cta.heading, locale)}
        body={loc(home.cta.body, locale)}
        primaryCta={loc(home.cta.primaryCta, locale)}
        secondaryCta={loc(home.cta.secondaryCta, locale)}
        phone={settings.contact.phone}
        image={mediaUrl(home.cta.image)}
      />
    </>
  );
}
