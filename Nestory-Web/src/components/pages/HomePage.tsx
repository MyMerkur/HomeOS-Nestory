import type { Dictionary, Locale } from "@/content/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ScrollShowcase } from "@/components/ScrollShowcase";
import { FeatureGrid } from "@/components/FeatureGrid";
import { DownloadSection } from "@/components/DownloadSection";
import { softwareAppJsonLd } from "@/lib/seo";

export function HomePage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd(locale)) }}
      />
      <Header dict={dict} locale={locale} />
      <main>
        <Hero
          eyebrow={dict.hero.eyebrow}
          title={dict.hero.title}
          subtitle={dict.hero.subtitle}
          ctaPrimary={dict.hero.ctaPrimary}
          ctaSecondary={dict.hero.ctaSecondary}
        />
        <ScrollShowcase
          eyebrow={dict.showcase.eyebrow}
          title={dict.showcase.title}
          subtitle={dict.showcase.subtitle}
          items={dict.showcase.items}
        />
        <FeatureGrid eyebrow={dict.features.eyebrow} title={dict.features.title} items={dict.features.items} />
        <DownloadSection
          title={dict.download.title}
          subtitle={dict.download.subtitle}
          comingSoon={dict.download.comingSoon}
          appStore={dict.download.appStore}
          playStore={dict.download.playStore}
        />
      </main>
      <Footer dict={dict} locale={locale} />
    </>
  );
}
