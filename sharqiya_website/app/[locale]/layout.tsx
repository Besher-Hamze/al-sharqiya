import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { IBM_Plex_Sans_Arabic, Inter, Sora } from "next/font/google";
import { routing } from "@/i18n/routing";
import { getNavigation, getServices, getSettings } from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { byOrder, SITE_URL } from "@/lib/utils";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: "%s | Al-Sharqiya Gypsum & GRC Group",
    },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar" },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      siteName: "Al-Sharqiya Gypsum & GRC Group",
      title: t("title"),
      description: t("description"),
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.jpg"],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [settings, navigation, services] = await Promise.all([
    getSettings(),
    getNavigation(),
    getServices(),
  ]);

  const headerMenu = byOrder(navigation.headerMenu).filter(
    (item) => !item.hidden && item.href,
  );

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${sora.variable} ${plexArabic.variable}`}
    >
      <body className="section-mesh flex min-h-dvh flex-col antialiased">
        <NextIntlClientProvider>
          <Header settings={settings} menu={headerMenu} />
          <main className="flex-1">{children}</main>
          <Footer
            settings={settings}
            navigation={navigation}
            services={services}
          />
          <FloatingActions
            whatsapp={settings.contact.whatsapp}
            phone={settings.contact.phone}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
