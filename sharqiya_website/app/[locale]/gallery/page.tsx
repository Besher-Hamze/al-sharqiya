import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getGallery, getSettings, mediaUrl } from "@/lib/api";
import { loc } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.gallery" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/gallery`,
      languages: { en: "/en/gallery", ar: "/ar/gallery" },
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [albums, settings, t, tp] = await Promise.all([
    getGallery(),
    getSettings(),
    getTranslations("gallery"),
    getTranslations("projects"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={loc(settings.tagline, locale)}
        title={t("title")}
        subtitle={t("subtitle")}
        image={albums[0] ? mediaUrl(albums[0].coverImage) : undefined}
      />

      {/* Album jump links */}
      {albums.length > 1 ? (
        <div className="sticky top-18 z-30 border-b border-ink-200 bg-white/85 backdrop-blur-xl">
          <nav
            className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8"
            aria-label={t("title")}
          >
            {albums.map((album) => (
              <a
                key={album.slug}
                href={`#${album.slug}`}
                className="shrink-0 rounded-full bg-ink-100 px-4 py-2 text-sm font-medium whitespace-nowrap text-graphite-700 transition hover:bg-gold-100 hover:text-gold-800"
              >
                {loc(album.title, locale)}
              </a>
            ))}
          </nav>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-20 sm:px-6 lg:px-8 lg:space-y-28">
        {albums.map((album) => (
          <section key={album.slug} id={album.slug} className="scroll-mt-32">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-2xl">
                  <h2 className="font-display text-2xl font-semibold text-graphite-950 sm:text-3xl">
                    {loc(album.title, locale)}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">
                    {loc(album.description, locale)}
                  </p>
                </div>
                <span className="tracking-brand rounded-full bg-gold-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700 ring-1 ring-gold-200">
                  {t("photoCount", { count: album.images.length })}
                </span>
              </div>
            </Reveal>

            <div className="mt-8">
              <GalleryGrid images={album.images} />
            </div>
          </section>
        ))}
      </div>

      <CtaBand
        heading={tp("ctaTitle")}
        body={tp("ctaBody")}
        primaryCta={tp("ctaButton")}
        phone={settings.contact.phone}
      />
    </>
  );
}
