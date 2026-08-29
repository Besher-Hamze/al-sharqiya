import type { MetadataRoute } from "next";
import { getProjects, getServices } from "@/lib/api";
import { SITE_URL } from "@/lib/utils";
import { routing } from "@/i18n/routing";

const STATIC_PATHS = [
  "",
  "/services",
  "/projects",
  "/gallery",
  "/about",
  "/faq",
  "/contact",
  "/quote",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects] = await Promise.all([
    getServices(),
    getProjects(),
  ]);

  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  const alternates = (path: string) => ({
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
    ),
  });

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: alternates(path),
      });
    }

    for (const service of services) {
      const path = `/services/${service.slug}`;
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.9,
        alternates: alternates(path),
      });
    }

    for (const project of projects) {
      const path = `/projects/${project.slug}`;
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: alternates(path),
      });
    }
  }

  return entries;
}
