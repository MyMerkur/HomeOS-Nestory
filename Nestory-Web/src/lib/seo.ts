import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { routes, locales, absoluteUrl, SITE_URL } from "@/content/routes";

const OG_LOCALE: Record<Locale, string> = {
  tr: "tr_TR",
  en: "en_US",
  cs: "cs_CZ",
};

type RouteKey = keyof (typeof routes)["tr"];

export function buildMetadata({
  locale,
  route,
  title,
  description,
}: {
  locale: Locale;
  route: RouteKey;
  title: string;
  description: string;
}): Metadata {
  const path = routes[locale][route];
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = absoluteUrl(routes[l][route]);
  }
  languages["x-default"] = absoluteUrl(routes.tr[route]);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
      languages,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: "Nestory",
      locale: OG_LOCALE[locale],
      type: "website",
      images: [
        {
          url: absoluteUrl("/og-image.png"),
          width: 1200,
          height: 630,
          alt: "Nestory",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/og-image.png")],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nestory",
    url: SITE_URL,
    logo: absoluteUrl("/icon.png"),
    email: "support@nestoryhomekit.com",
  };
}

export function softwareAppJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Nestory",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android",
    url: absoluteUrl(routes[locale].home),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
