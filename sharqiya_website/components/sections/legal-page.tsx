import { getLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Prose } from "@/components/sections/prose";
import { loc } from "@/lib/utils";
import type { LegalPage as LegalPageType } from "@/lib/types";

export async function LegalPageBody({ page }: { page: LegalPageType }) {
  const locale = await getLocale();

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="space-y-12">
        {page.sections.map((section, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <article>
              {section.heading ? (
                <h2 className="font-display text-2xl font-semibold text-graphite-950">
                  {loc(section.heading, locale)}
                </h2>
              ) : null}
              <Prose
                text={loc(section.body, locale)}
                className="mt-4 text-[15px]"
              />
            </article>
          </Reveal>
        ))}
      </div>

      {page.updatedAt ? (
        <p className="mt-16 border-t border-ink-200 pt-6 text-xs text-ink-400">
          <time dateTime={page.updatedAt}>
            {new Intl.DateTimeFormat(locale === "ar" ? "ar-AE" : "en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(page.updatedAt))}
          </time>
        </p>
      ) : null}
    </section>
  );
}
