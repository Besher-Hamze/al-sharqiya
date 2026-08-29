import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { mediaUrl } from "@/lib/media";
import { loc } from "@/lib/utils";
import type { Service } from "@/lib/types";

export function ServiceCard({
  service,
  locale,
  cta,
}: {
  service: Service;
  locale: string;
  cta: string;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="brand-card group flex h-full flex-col overflow-hidden ring-1 ring-ink-200/70"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={mediaUrl(service.coverImage)}
          alt={loc(service.name, locale)}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-graphite-950/70 via-transparent to-transparent"
          aria-hidden
        />
        <span className="absolute bottom-4 start-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 text-graphite-950 shadow-lift">
          <DynamicIcon name={service.icon} className="h-5 w-5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-graphite-950 transition-colors group-hover:text-gold-700">
          {loc(service.name, locale)}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">
          {loc(service.excerpt, locale)}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
          {cta}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
