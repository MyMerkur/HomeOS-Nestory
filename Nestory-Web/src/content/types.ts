export type Locale = "tr" | "en" | "cs";

export type ShowcaseItem = {
  title: string;
  description: string;
  tag: string;
};

export type FeatureIcon =
  | "pantry"
  | "shopping"
  | "bills"
  | "assets"
  | "medicine"
  | "waste"
  | "widget"
  | "family";

export type FeatureItem = {
  icon: FeatureIcon;
  title: string;
  description: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type PrivacySection = {
  heading: string;
  body: string;
};

export type Dictionary = {
  locale: Locale;
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    features: string;
    support: string;
    privacy: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  showcase: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: ShowcaseItem[];
  };
  features: {
    eyebrow: string;
    title: string;
    items: FeatureItem[];
  };
  download: {
    title: string;
    subtitle: string;
    comingSoon: string;
    appStore: string;
    playStore: string;
  };
  footer: {
    tagline: string;
    productTitle: string;
    languageTitle: string;
    rights: string;
  };
  support: {
    title: string;
    intro: string;
    faq: FaqItem[];
    contactTitle: string;
    contactBody: string;
  };
  privacy: {
    title: string;
    updated: string;
    intro: string;
    sections: PrivacySection[];
    contact: string;
  };
  terms: {
    title: string;
    updated: string;
    body: string;
    contact: string;
  };
};
