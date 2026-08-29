import { getLocale, getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TikTokIcon,
} from "@/components/ui/social-icons";
import { byOrder, loc } from "@/lib/utils";
import type { Navigation, Service, Settings } from "@/lib/types";

export async function Footer({
  settings,
  navigation,
  services,
}: {
  settings: Settings;
  navigation: Navigation;
  services: Service[];
}) {
  const t = await getTranslations("footer");
  const locale = await getLocale();

  const { contact, social } = settings;

  const socials = [
    { name: "Instagram", href: social.instagram, Icon: InstagramIcon },
    { name: "LinkedIn", href: social.linkedin, Icon: LinkedinIcon },
    { name: "Facebook", href: social.facebook, Icon: FacebookIcon },
    { name: "TikTok", href: social.tiktok, Icon: TikTokIcon },
  ].filter((s) => s.href);

  return (
    <footer className="section-dark noise-overlay relative mt-24 overflow-hidden text-graphite-200">
      <div
        className="pointer-events-none absolute -top-32 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-500/15 blur-[110px]"
        aria-hidden
      />
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo
            name={loc(settings.siteName, locale)}
            tagline={loc(settings.tagline, locale)}
            light
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-graphite-300/85">
            {loc(settings.shortDescription, locale)}
          </p>
          <p className="tracking-brand mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">
            {t("established", { year: settings.foundedYear })}
          </p>
          {socials.length > 0 ? (
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-gold-500 hover:text-graphite-950 hover:shadow-glow"
                >
                  <s.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <nav aria-label={t("explore")}>
          <h3 className="tracking-brand mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            {t("explore")}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {byOrder(navigation.footerMenu)
              .filter((item) => !item.hidden && item.href)
              .map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-graphite-300/85 transition hover:text-gold-300"
                  >
                    {loc(item.label, locale)}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <nav aria-label={t("services")}>
          <h3 className="tracking-brand mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            {t("services")}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {services.slice(0, 6).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-graphite-300/85 transition hover:text-gold-300"
                >
                  {loc(service.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="tracking-brand mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            {t("contact")}
          </h3>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
                aria-hidden
              />
              <address className="not-italic leading-relaxed text-graphite-300/85">
                {loc(contact.headOffice, locale)}
              </address>
            </li>
            <li>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-graphite-300/85 transition hover:text-gold-300"
              >
                <Phone className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                <span dir="ltr">{contact.phone}</span>
              </a>
            </li>
            {contact.phoneAlt ? (
              <li>
                <a
                  href={`tel:${contact.phoneAlt.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-graphite-300/85 transition hover:text-gold-300"
                >
                  <Phone
                    className="h-4 w-4 shrink-0 text-gold-400"
                    aria-hidden
                  />
                  <span dir="ltr">{contact.phoneAlt}</span>
                </a>
              </li>
            ) : null}
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 break-all text-graphite-300/85 transition hover:text-gold-300"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                {contact.email}
              </a>
            </li>
          </ul>

          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {byOrder(navigation.legalMenu)
              .filter((item) => !item.hidden)
              .map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-graphite-400 transition hover:text-gold-300"
                  >
                    {loc(item.label, locale)}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-graphite-400 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {loc(settings.siteName, locale)}.{" "}
            {t("rights")}
          </p>
          <p dir="ltr">{loc(settings.tagline, locale)}</p>
        </div>
      </div>
    </footer>
  );
}
