import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Absolute URL; when present it becomes a dimmed background photograph. */
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "noise-overlay relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-28",
        image ? "bg-graphite-950" : "section-dark",
      )}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            priority
            unoptimized
            className="object-cover opacity-35 motion-safe:animate-ken-burns"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-graphite-950/80 to-graphite-950/50"
            aria-hidden
          />
        </>
      ) : (
        <>
          <div
            className="pointer-events-none absolute -top-24 end-0 h-80 w-80 rounded-full bg-gold-500/20 blur-[110px] motion-safe:animate-float"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-32 start-0 h-96 w-96 rounded-full bg-gold-400/10 blur-[100px] motion-safe:animate-float-slow"
            aria-hidden
          />
        </>
      )}

      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          {eyebrow ? (
            <div className="mb-6 flex items-center gap-3">
              <span
                className="h-px w-12 bg-gradient-to-r from-gold-400 to-transparent"
                aria-hidden
              />
              <span className="tracking-brand text-[11px] font-bold uppercase tracking-[0.28em] text-gold-300">
                {eyebrow}
              </span>
            </div>
          ) : null}
          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-graphite-200/85 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}
