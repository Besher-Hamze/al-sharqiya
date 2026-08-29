import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";

/** Full-bleed conversion band closing most pages. */
export function CtaBand({
  heading,
  body,
  primaryCta,
  secondaryCta,
  phone,
  image,
}: {
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta?: string;
  phone?: string;
  /** Absolute URL of a dimmed background photograph. */
  image?: string;
}) {
  return (
    <section className="noise-overlay relative overflow-hidden bg-graphite-950">
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-graphite-950 via-graphite-950/85 to-graphite-950/60"
            aria-hidden
          />
        </>
      ) : (
        <div className="section-dark absolute inset-0" aria-hidden />
      )}
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="max-w-2xl">
          <span
            className="block h-px w-16 bg-gradient-to-r from-gold-400 to-transparent"
            aria-hidden
          />
          <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.1] text-white sm:text-4xl lg:text-[2.75rem]">
            {heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-graphite-200/85 sm:text-lg">
            {body}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/quote"
              className="btn-shimmer inline-flex h-13 items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-8 text-base font-semibold text-graphite-950 shadow-lift transition hover:shadow-glow"
            >
              {primaryCta}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
            {secondaryCta && phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex h-13 items-center gap-2 rounded-full border border-white/30 px-7 text-base font-semibold text-white backdrop-blur-sm transition hover:border-gold-300 hover:bg-white/10"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {secondaryCta}
              </a>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
