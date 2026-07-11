import type { Metadata } from "next";
import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { getDictionary } from "@/content";
import { buildMetadata } from "@/lib/seo";

const dict = getDictionary("cs");

export const metadata: Metadata = buildMetadata({
  locale: "cs",
  route: "privacy",
  title: `${dict.privacy.title} — Nestory`,
  description: dict.privacy.intro,
});

export default function Page() {
  return <PrivacyPage dict={dict} locale="cs" />;
}
