import type { Locale } from "./types";

export const SITE_URL = "https://nestoryhomekit.com";

export const locales: Locale[] = ["tr", "en", "cs"];

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  cs: "Čeština",
};

type RouteKey = "home" | "support" | "privacy" | "terms";

// Next.js is configured with `trailingSlash: true` (static export), so every
// route's canonical, final URL ends in a slash — these must match exactly,
// since metadata (canonical/hreflang/sitemap) isn't auto-normalized by Next
// the way `next/link` hrefs are.
export const routes: Record<Locale, Record<RouteKey, string>> = {
  tr: {
    home: "/",
    support: "/destek/",
    privacy: "/privacy/",
    terms: "/terms/",
  },
  en: {
    home: "/en/",
    support: "/en/support/",
    privacy: "/en/privacy/",
    terms: "/en/terms/",
  },
  cs: {
    home: "/cs/",
    support: "/cs/podpora/",
    privacy: "/cs/privacy/",
    terms: "/cs/terms/",
  },
};

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
