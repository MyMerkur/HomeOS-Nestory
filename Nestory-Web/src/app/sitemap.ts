import type { MetadataRoute } from "next";
import { routes, locales, absoluteUrl } from "@/content/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const r = routes[locale];
    for (const path of Object.values(r)) {
      entries.push({
        url: absoluteUrl(path),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: path === r.home ? 1 : 0.6,
      });
    }
  }

  return entries;
}
