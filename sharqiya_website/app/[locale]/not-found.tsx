import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <section className="section-dark noise-overlay relative flex min-h-[70svh] items-center overflow-hidden">
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-20 end-10 h-80 w-80 rounded-full bg-gold-500/15 blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="font-display text-7xl font-semibold text-gradient-gold sm:text-8xl">
          404
        </p>
        <h1 className="mt-6 font-display text-3xl font-semibold text-white sm:text-4xl">
          {t("notFoundTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-graphite-300">
          {t("notFoundBody")}
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-7 text-sm font-semibold text-graphite-950 transition hover:shadow-glow"
        >
          {t("backHome")}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
