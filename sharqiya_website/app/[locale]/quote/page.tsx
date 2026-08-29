import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClipboardCheck, FileText, Handshake, Phone } from "lucide-react";
import { getServices, getSettings, mediaUrl } from "@/lib/api";
import { loc, waLink } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { QuoteForm } from "@/components/sections/quote-form";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.quote" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/quote`,
      languages: { en: "/en/quote", ar: "/ar/quote" },
    },
  };
}

export default async function QuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const [{ locale }, { service: preselected }] = await Promise.all([
    params,
    searchParams,
  ]);
  setRequestLocale(locale);

  const [services, settings, t] = await Promise.all([
    getServices(),
    getSettings(),
    getTranslations("quote"),
  ]);

  const defaultService = services.some((s) => s.slug === preselected)
    ? preselected
    : undefined;

  const assurances = [
    {
      Icon: ClipboardCheck,
      title: t("assurances.survey"),
      body: t("assurances.surveyBody"),
    },
    {
      Icon: FileText,
      title: t("assurances.written"),
      body: t("assurances.writtenBody"),
    },
    {
      Icon: Handshake,
      title: t("assurances.single"),
      body: t("assurances.singleBody"),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={loc(settings.tagline, locale)}
        title={t("title")}
        subtitle={t("subtitle")}
        image={services[1] ? mediaUrl(services[1].coverImage) : undefined}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          <Reveal className="lg:col-span-3">
            <QuoteForm
              services={services.map((s) => ({
                slug: s.slug,
                label: loc(s.name, locale),
              }))}
              defaultService={defaultService}
            />
          </Reveal>

          <div className="space-y-6 lg:col-span-2">
            <Reveal delay={0.08}>
              <ul className="space-y-4">
                {assurances.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-200/70"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                      <item.Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-display text-sm font-semibold text-graphite-950">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-500">
                        {item.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="rounded-2xl bg-graphite-950 p-6 text-white shadow-lift">
                <p className="text-sm leading-relaxed text-graphite-300">
                  {loc(settings.shortDescription, locale)}
                </p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <a
                    href={`tel:${settings.contact.phone.replace(/\s/g, "")}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    <span dir="ltr">{settings.contact.phone}</span>
                  </a>
                  <a
                    href={waLink(settings.contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white transition hover:brightness-105"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
