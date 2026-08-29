import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, Phone } from "lucide-react";
import {
  getAbout,
  getHomepage,
  getSettings,
  mediaUrl,
} from "@/lib/api";
import { byOrder, loc } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stats } from "@/components/sections/stats";
import { Prose } from "@/components/sections/prose";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: "/en/about", ar: "/ar/about" },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [about, home, settings, t] = await Promise.all([
    getAbout(),
    getHomepage(),
    getSettings(),
    getTranslations("about"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={loc(about.hero.eyebrow, locale)}
        title={loc(about.hero.title, locale)}
        subtitle={loc(about.hero.subtitle, locale)}
        image={mediaUrl(about.hero.image)}
      />

      {/* Numbers */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading title={t("statsTitle")} />
        <Stats
          className="mt-12"
          items={home.stats.map((stat) => ({
            value: stat.value,
            label: loc(stat.label, locale),
          }))}
        />
      </section>

      {/* Story sections, alternating image side */}
      <section className="section-mesh-bone py-20 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8 lg:space-y-24">
          {about.sections.map((section, i) => (
            <div
              key={i}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <Reveal className={i % 2 === 1 ? "lg:order-2" : ""}>
                <span
                  className="block h-px w-14 bg-gradient-to-r from-gold-500 to-transparent"
                  aria-hidden
                />
                <h2 className="mt-6 font-display text-2xl font-semibold text-graphite-950 sm:text-3xl">
                  {loc(section.heading, locale)}
                </h2>
                <Prose
                  text={loc(section.body, locale)}
                  className="mt-5 text-base"
                />
              </Reveal>

              <Reveal
                delay={0.1}
                className={`editorial-frame aspect-4/3 ${i % 2 === 1 ? "lg:order-1" : ""}`}
              >
                <Image
                  src={mediaUrl(section.image)}
                  alt={loc(section.heading, locale)}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Milestone timeline */}
      <section className="section-dark noise-overlay relative overflow-hidden py-20 lg:py-28">
        <div
          className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("milestonesEyebrow")}
            title={t("milestonesTitle")}
            light
          />

          <Stagger className="relative mt-16 grid gap-8 lg:grid-cols-4">
            <span
              className="pointer-events-none absolute inset-x-0 top-3 hidden h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent lg:block"
              aria-hidden
            />
            {about.milestones.map((milestone) => (
              <StaggerItem key={milestone.year} className="relative">
                <span
                  className="absolute start-0 top-1.5 hidden h-3 w-3 rounded-full bg-gold-500 ring-4 ring-graphite-950 lg:block"
                  aria-hidden
                />
                <div className="lg:pt-10">
                  <p className="font-display text-xl font-semibold text-gradient-gold">
                    {milestone.year}
                  </p>
                  <h3 className="mt-2 font-display text-base font-semibold text-white">
                    {loc(milestone.title, locale)}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-graphite-300/85">
                    {loc(milestone.body, locale)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Branches */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow={t("branchesEyebrow")}
          title={t("branchesTitle")}
        />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {byOrder(settings.branches).map((branch) => (
            <StaggerItem key={loc(branch.city, locale)}>
              <div className="brand-card h-full p-6 ring-1 ring-ink-200/70">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-graphite-950">
                  {loc(branch.city, locale)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {loc(branch.address, locale)}
                </p>
                {branch.phone ? (
                  <a
                    href={`tel:${branch.phone.replace(/\s/g, "")}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition hover:text-gold-800"
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    <span dir="ltr">{branch.phone}</span>
                  </a>
                ) : null}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaBand
        heading={t("ctaTitle")}
        body={t("ctaBody")}
        primaryCta={t("ctaButton")}
        phone={settings.contact.phone}
        image={mediaUrl(about.hero.image)}
      />
    </>
  );
}
