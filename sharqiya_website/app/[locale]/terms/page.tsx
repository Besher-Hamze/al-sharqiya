import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getLegalPage } from "@/lib/api";
import { loc } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { LegalPageBody } from "@/components/sections/legal-page";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getLegalPage("terms");
  if (!page) return {};

  return {
    title: loc(page.title, locale),
    description: loc(page.seo?.description, locale) || undefined,
    alternates: {
      canonical: `/${locale}/terms`,
      languages: { en: "/en/terms", ar: "/ar/terms" },
    },
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await getLegalPage("terms");
  if (!page) notFound();

  return (
    <>
      <PageHero title={loc(page.title, locale)} />
      <LegalPageBody page={page} />
    </>
  );
}
