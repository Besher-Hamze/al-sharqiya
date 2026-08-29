import Image from "next/image";
import { ArrowUpRight, MapPin, Ruler } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { mediaUrl } from "@/lib/media";
import { cn, loc } from "@/lib/utils";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  locale,
  /** `feature` renders a taller, editorial-sized card for the homepage grid. */
  variant = "default",
}: {
  project: Project;
  locale: string;
  variant?: "default" | "feature";
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-graphite-950 shadow-soft transition-shadow duration-500 hover:shadow-lift",
        variant === "feature" ? "aspect-4/5 sm:aspect-3/4" : "aspect-4/3",
      )}
    >
      <Image
        src={mediaUrl(project.coverImage)}
        alt={loc(project.title, locale)}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-graphite-950/45 to-transparent"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold text-gold-300">
          {project.location?.en || project.location?.ar ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden />
              {loc(project.location, locale)}
            </span>
          ) : null}
          {project.area ? (
            <span className="inline-flex items-center gap-1" dir="ltr">
              <Ruler className="h-3 w-3" aria-hidden />
              {project.area}
            </span>
          ) : null}
        </div>

        <h3 className="mt-2 font-display text-lg leading-snug font-semibold text-white sm:text-xl">
          {loc(project.title, locale)}
        </h3>

        {/* Excerpt is held back until hover to keep the grid calm */}
        <p className="mt-0 max-h-0 overflow-hidden text-sm leading-relaxed text-graphite-200/85 opacity-0 transition-all duration-500 group-hover:mt-2.5 group-hover:max-h-32 group-hover:opacity-100">
          {loc(project.excerpt, locale)}
        </p>
      </div>

      <span className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:bg-gold-500 group-hover:text-graphite-950 group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
      </span>
    </Link>
  );
}
