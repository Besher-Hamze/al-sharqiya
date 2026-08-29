import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/api";
import { byOrder, loc, waLink } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.contact" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: "/en/contact", ar: "/ar/contact" },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [settings, t] = await Promise.all([
    getSettings(),
    getTranslations("contact"),
  ]);

  const { contact } = settings;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: loc(settings.siteName, locale),
    telephone: contact.phone,
    email: contact.email,
    address: byOrder(settings.branches).map((branch) => ({
      "@type": "PostalAddress",
      addressLocality: loc(branch.city, locale),
      streetAddress: loc(branch.address, locale),
      addressCountry: "AE",
    })),
    openingHoursSpecification: settings.openingHours
      .filter((hour) => !hour.closed)
      .map((hour) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hour.day.en,
        opens: hour.open,
        closes: hour.close,
      })),
  };

  const channels = [
    {
      label: t("phone"),
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
      Icon: Phone,
    },
    contact.phoneAlt
      ? {
          label: t("phoneAlt"),
          value: contact.phoneAlt,
          href: `tel:${contact.phoneAlt.replace(/\s/g, "")}`,
          Icon: Phone,
        }
      : null,
    {
      label: t("email"),
      value: contact.email,
      href: `mailto:${contact.email}`,
      Icon: Mail,
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    href: string;
    Icon: typeof Phone;
  }[];

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

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          <Reveal className="lg:col-span-3">
            <ContactForm />
          </Reveal>

          <div className="space-y-6 lg:col-span-2">
            <Reveal delay={0.08}>
              <div className="rounded-2xl bg-graphite-950 p-6 text-white shadow-lift">
                <h2 className="tracking-brand text-[11px] font-bold uppercase tracking-[0.22em] text-gold-400">
                  {t("detailsTitle")}
                </h2>
                <ul className="mt-5 space-y-4">
                  {channels.map((channel) => (
                    <li key={channel.label}>
                      <a
                        href={channel.href}
                        className="group flex items-start gap-3"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-400 transition group-hover:bg-gold-500 group-hover:text-graphite-950">
                          <channel.Icon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs text-graphite-400">
                            {channel.label}
                          </span>
                          <span
                            className="mt-0.5 block text-sm font-semibold break-all text-white transition group-hover:text-gold-300"
                            dir={channel.label === t("email") ? undefined : "ltr"}
                          >
                            {channel.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={waLink(contact.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#25D366] transition group-hover:bg-[#25D366] group-hover:text-white">
                        <WhatsAppIcon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-xs text-graphite-400">
                          {t("whatsapp")}
                        </span>
                        <span className="mt-0.5 block text-sm font-semibold text-white transition group-hover:text-[#25D366]">
                          {t("whatsapp")}
                        </span>
                      </span>
                    </a>
                  </li>
                </ul>

                <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
                    aria-hidden
                  />
                  <span>
                    <span className="block text-xs text-graphite-400">
                      {t("headOffice")}
                    </span>
                    <address className="mt-0.5 text-sm leading-relaxed text-graphite-200 not-italic">
                      {loc(contact.headOffice, locale)}
                    </address>
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink-200/70">
                <h2 className="tracking-brand text-[11px] font-bold uppercase tracking-[0.22em] text-gold-700">
                  {t("hoursTitle")}
                </h2>
                <dl className="mt-4 divide-y divide-ink-100">
                  {settings.openingHours.map((hour) => (
                    <div
                      key={hour.day.en}
                      className="flex items-center justify-between py-2.5 text-sm"
                    >
                      <dt className="text-graphite-700">
                        {loc(hour.day, locale)}
                      </dt>
                      <dd
                        className={
                          hour.closed
                            ? "text-ink-400"
                            : "font-medium text-graphite-900"
                        }
                        dir={hour.closed ? undefined : "ltr"}
                      >
                        {hour.closed
                          ? t("closed")
                          : `${hour.open} – ${hour.close}`}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="section-mesh-bone py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-graphite-950 sm:text-3xl">
            {t("branchesTitle")}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {byOrder(settings.branches).map((branch) => (
              <div
                key={loc(branch.city, locale)}
                className="brand-card h-full p-6 ring-1 ring-ink-200/70"
              >
                <h3 className="font-display text-lg font-semibold text-graphite-950">
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
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
