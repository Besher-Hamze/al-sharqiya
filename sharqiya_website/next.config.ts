import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Uploads are served by the NestJS backend, whose origin differs per
 * environment. Build one remote pattern per configured origin so
 * next/image accepts them all.
 */
function backendImagePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const origins = [
    process.env.NEXT_PUBLIC_ASSET_URL,
    process.env.NEXT_PUBLIC_API_URL,
    process.env.API_URL,
    "http://localhost:4000",
  ].filter(Boolean) as string[];

  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
  const seen = new Set<string>();

  for (const raw of origins) {
    try {
      const url = new URL(raw);
      const key = `${url.protocol}//${url.host}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const protocol = url.protocol.replace(":", "") as "http" | "https";
      patterns.push({
        protocol,
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: "/uploads/**",
      });
    } catch {
      /* skip invalid origins */
    }
  }

  if (patterns.length === 0) {
    return [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
        pathname: "/uploads/**",
      },
    ];
  }

  return patterns;
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: backendImagePatterns(),
    dangerouslyAllowLocalIP: true,
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
