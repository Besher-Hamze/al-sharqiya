import "server-only";
import { mediaUrl as resolveMediaUrl } from "./media";
import type {
  AboutContent,
  Faq,
  GalleryAlbum,
  HomepageContent,
  LegalPage,
  Navigation,
  Project,
  Service,
  Settings,
  Testimonial,
} from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:4000";
const REVALIDATE_SECONDS = 60;
const IS_DEV = process.env.NODE_ENV === "development";

class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly path: string,
  ) {
    super(`API ${status} on ${path}`);
    this.name = "ApiError";
  }
}

/**
 * Reads are cached with ISR in production and bypassed in development so
 * dashboard edits show up immediately while building.
 */
async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(
    `${API_URL}/api/v1${path}`,
    IS_DEV
      ? { cache: "no-store" }
      : { next: { revalidate: REVALIDATE_SECONDS } },
  );

  if (!res.ok) throw new ApiError(res.status, path);

  const json: unknown = await res.json();
  if (json && typeof json === "object" && "data" in json) {
    return (json as { data: T }).data;
  }
  return json as T;
}

/** Same as `fetchApi` but resolves to `null` on 404 so pages can 404 cleanly. */
async function fetchApiOptional<T>(path: string): Promise<T | null> {
  try {
    return await fetchApi<T>(path);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function mediaUrl(src: string | undefined | null): string {
  return resolveMediaUrl(src);
}

// --- Singletons -------------------------------------------------------------

export const getSettings = () => fetchApi<Settings>("/settings");
export const getNavigation = () => fetchApi<Navigation>("/navigation");

// --- Composed page content --------------------------------------------------

export const getHomepage = () =>
  fetchApi<HomepageContent>("/content/homepage");
export const getAbout = () => fetchApi<AboutContent>("/content/about");

// --- Collections ------------------------------------------------------------

export const getServices = () => fetchApi<Service[]>("/services");
export const getService = (slug: string) =>
  fetchApiOptional<Service>(`/services/${slug}`);

export const getProjects = () => fetchApi<Project[]>("/projects");
export const getProject = (slug: string) =>
  fetchApiOptional<Project>(`/projects/${slug}`);

export const getGallery = () => fetchApi<GalleryAlbum[]>("/gallery");
export const getAlbum = (slug: string) =>
  fetchApiOptional<GalleryAlbum>(`/gallery/${slug}`);

export const getFaqs = () => fetchApi<Faq[]>("/faqs");
export const getTestimonials = () => fetchApi<Testimonial[]>("/testimonials");

export const getLegalPage = (slug: string) =>
  fetchApiOptional<LegalPage>(`/pages/${slug}`);
