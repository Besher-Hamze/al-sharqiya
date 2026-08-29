/**
 * Media stored by the backend is referenced in the database as a root-relative
 * path (`/uploads/media/library/foo.webp`). The browser needs an absolute URL
 * pointing at the API origin, which differs per environment.
 */
const API_ORIGIN = (
  process.env.NEXT_PUBLIC_ASSET_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:4000"
).replace(/\/$/, "");

export function mediaUrl(src: string | undefined | null): string {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("data:")) return src;

  let path = src.startsWith("/") ? src : `/${src}`;
  if (!path.startsWith("/uploads/")) {
    path = `/uploads${path.startsWith("/media/") ? "" : "/media"}${path}`;
  }
  return `${API_ORIGIN}${path}`;
}

/** Backend writes a `.thumb.webp` sibling next to every processed upload. */
export function thumbUrl(src: string | undefined | null): string {
  if (!src) return "";
  const full = mediaUrl(src);
  return full.replace(/\.(webp|jpg|jpeg|png)$/i, ".thumb.$1");
}
