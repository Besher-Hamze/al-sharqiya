"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Menu, Phone, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/ui/logo";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { cn, loc, waLink } from "@/lib/utils";
import type { NavItem, Settings } from "@/lib/types";

export function Header({
  settings,
  menu,
}: {
  settings: Settings;
  menu: NavItem[];
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer when the route changes, adjusted during render rather
  // than in an effect to avoid a cascading re-render.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const otherLocale = locale === "en" ? "ar" : "en";
  // Unscrolled, the header floats over a dark hero image and needs light text.
  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-gold-200/40 bg-white/90 shadow-soft backdrop-blur-2xl"
          : "bg-gradient-to-b from-graphite-950/60 via-graphite-950/25 to-transparent backdrop-blur-[2px]",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label={loc(settings.siteName, locale)}>
          <Logo
            name={loc(settings.siteName, locale)}
            tagline={loc(settings.tagline, locale)}
            light={!solid}
            className="max-w-[15rem]"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {menu.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                  solid
                    ? active
                      ? "text-gold-700"
                      : "text-graphite-700 hover:text-gold-700"
                    : active
                      ? "text-graphite-900"
                      : "text-white hover:text-gold-200",
                )}
              >
                {loc(item.label, locale)}
                {active ? (
                  <motion.span
                    layoutId="nav-pill"
                    className={cn(
                      "absolute inset-0 -z-10 rounded-full",
                      solid
                        ? "bg-gold-50 ring-1 ring-gold-200"
                        : "bg-white/95 shadow-soft",
                    )}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={pathname}
            locale={otherLocale}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition",
              solid
                ? "text-graphite-700 ring-1 ring-ink-200 hover:text-gold-700 hover:ring-gold-400"
                : "bg-white/15 text-white ring-1 ring-white/40 backdrop-blur-md hover:bg-white/25",
            )}
            aria-label={t("switchLocale")}
          >
            <Globe className="h-4 w-4" aria-hidden />
            <span>{t("switchLocale")}</span>
          </Link>

          <Link
            href="/quote"
            className="hidden h-10 items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-5 text-sm font-semibold text-graphite-950 shadow-soft transition hover:shadow-glow sm:inline-flex"
          >
            {t("quote")}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full transition lg:hidden",
              solid
                ? "text-graphite-800 ring-1 ring-ink-200"
                : "bg-white/15 text-white ring-1 ring-white/40 backdrop-blur-md",
            )}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("menu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.button
            type="button"
            aria-hidden
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-18 -z-10 cursor-default bg-graphite-950/50 backdrop-blur-sm lg:hidden"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-b border-gold-200/50 bg-white shadow-lift lg:hidden"
          >
            <nav
              className="flex max-h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto px-4 pt-2 pb-6"
              aria-label="Mobile"
            >
              {menu.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: locale === "ar" ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={item.href}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-graphite-800 transition hover:bg-gold-50 hover:text-gold-700"
                  >
                    {loc(item.label, locale)}
                  </Link>
                </motion.div>
              ))}

              <Link
                href="/quote"
                className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-6 font-semibold text-graphite-950 shadow-lift"
              >
                {t("quote")}
              </Link>
              <a
                href={`tel:${settings.contact.phone.replace(/\s/g, "")}`}
                className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-graphite-900 px-6 font-semibold text-white"
              >
                <Phone className="h-4 w-4" aria-hidden />
                <span dir="ltr">{settings.contact.phone}</span>
              </a>
              <a
                href={waLink(settings.contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 font-semibold text-white"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
