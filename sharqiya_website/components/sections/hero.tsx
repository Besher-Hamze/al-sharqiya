"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const SLIDE_MS = 6000;

export function Hero({
  eyebrow,
  titleLine1,
  titleLine2,
  subtitle,
  primaryCta,
  secondaryCta,
  slides,
  phone,
  stats,
}: {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  /** Absolute image URLs. */
  slides: string[];
  phone: string;
  stats: { value: string; label: string }[];
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || slides.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_MS,
    );
    return () => clearInterval(id);
  }, [reduce, slides.length]);

  return (
    <section className="noise-overlay relative min-h-[92svh] overflow-hidden bg-graphite-950">
      {/* Cross-fading project photography */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index] ?? ""}
            alt=""
            fill
            priority={index === 0}
            unoptimized
            sizes="100vw"
            className={cn(
              "object-cover",
              !reduce && "motion-safe:animate-ken-burns",
            )}
          />
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-graphite-950/85 to-graphite-950/55"
        aria-hidden
      />
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-20 end-10 h-96 w-96 rounded-full bg-gold-500/15 blur-[130px] motion-safe:animate-glow-pulse"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-4 pt-36 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.21, 0.65, 0.32, 0.99] }}
          className="max-w-3xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <span
              className="h-px w-12 bg-gradient-to-r from-gold-400 to-transparent"
              aria-hidden
            />
            <span className="tracking-brand text-[11px] font-bold uppercase tracking-[0.28em] text-gold-300">
              {eyebrow}
            </span>
          </div>

          <h1 className="font-display text-[2.6rem] font-semibold leading-[1.04] text-white sm:text-6xl lg:text-[4.25rem]">
            {titleLine1}
            <br />
            <span className="text-gradient-gold">{titleLine2}</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-graphite-200/90 sm:text-lg">
            {subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/quote"
              className="btn-shimmer inline-flex h-13 items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-8 text-base font-semibold text-graphite-950 shadow-lift transition hover:shadow-glow"
            >
              {primaryCta}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
            <Link
              href="/projects"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-white/30 px-7 text-base font-semibold text-white backdrop-blur-sm transition hover:border-gold-300 hover:bg-white/10"
            >
              {secondaryCta}
            </Link>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="inline-flex h-13 items-center gap-2 rounded-full px-4 text-base font-semibold text-graphite-200 transition hover:text-gold-300"
            >
              <Phone className="h-4 w-4" aria-hidden />
              <span dir="ltr">{phone}</span>
            </a>
          </div>
        </motion.div>

        {/* Key figures, doubling as the visual base of the hero */}
        <motion.dl
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.25,
            ease: [0.21, 0.65, 0.32, 0.99],
          }}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-graphite-950/40 px-5 py-5">
              <dt className="tracking-brand text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300/90">
                {stat.label}
              </dt>
              <dd className="mt-1.5 font-display text-2xl font-semibold text-white sm:text-[1.75rem]">
                {stat.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 ? (
        <div className="absolute bottom-5 start-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === index ? "w-8 bg-gold-400" : "w-1.5 bg-white/40",
              )}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
