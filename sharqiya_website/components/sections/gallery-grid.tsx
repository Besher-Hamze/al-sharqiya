"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { mediaUrl, thumbUrl } from "@/lib/media";
import { byOrder, loc } from "@/lib/utils";
import type { ContentImage } from "@/lib/types";

export function GalleryGrid({
  images,
  columns = 3,
}: {
  images: ContentImage[];
  columns?: 2 | 3 | 4;
}) {
  const locale = useLocale();
  const t = useTranslations("gallery");
  const [active, setActive] = useState<number | null>(null);
  const ordered = byOrder(images);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (delta: number) =>
      setActive((i) =>
        i === null ? null : (i + delta + ordered.length) % ordered.length,
      ),
    [ordered.length],
  );

  useEffect(() => {
    if (active === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  const gridCols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <Stagger className={`grid grid-cols-1 gap-4 ${gridCols}`}>
        {ordered.map((image, i) => (
          <StaggerItem key={`${image.src}-${i}`}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group relative block aspect-4/3 w-full overflow-hidden rounded-2xl bg-graphite-900 shadow-soft transition-shadow duration-500 hover:shadow-lift"
            >
              <Image
                src={thumbUrl(image.src)}
                alt={loc(image.alt, locale)}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-graphite-950/75 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
              <span className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:bg-gold-500 group-hover:text-graphite-950 group-hover:opacity-100">
                <ZoomIn className="h-4 w-4" aria-hidden />
              </span>
              {loc(image.alt, locale) ? (
                <span className="absolute inset-x-0 bottom-0 p-4 text-start text-sm font-medium text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {loc(image.alt, locale)}
                </span>
              ) : null}
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      <AnimatePresence>
        {active !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-100 flex items-center justify-center bg-graphite-950/95 backdrop-blur-md"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="absolute end-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            {ordered.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label={t("previous")}
                  className="absolute start-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-gold-500 hover:text-graphite-950 sm:start-6"
                >
                  <ChevronLeft className="h-6 w-6 rtl:rotate-180" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label={t("next")}
                  className="absolute end-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-gold-500 hover:text-graphite-950 sm:end-6"
                >
                  <ChevronRight
                    className="h-6 w-6 rtl:rotate-180"
                    aria-hidden
                  />
                </button>
              </>
            ) : null}

            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative mx-auto flex max-h-[88vh] w-full max-w-5xl flex-col px-14 sm:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative min-h-0 flex-1">
                <Image
                  src={mediaUrl(ordered[active].src)}
                  alt={loc(ordered[active].alt, locale)}
                  width={1920}
                  height={1280}
                  unoptimized
                  className="mx-auto max-h-[78vh] w-auto rounded-xl object-contain shadow-lift"
                />
              </div>
              <figcaption className="mt-4 text-center text-sm text-graphite-300">
                {loc(ordered[active].alt, locale)}
                <span className="mx-2 text-graphite-600">·</span>
                <span dir="ltr" className="text-graphite-400">
                  {active + 1} / {ordered.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
