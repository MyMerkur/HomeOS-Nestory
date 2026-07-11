import type { Metadata } from "next";
import { SupportPage } from "@/components/pages/SupportPage";
import { getDictionary } from "@/content";
import { buildMetadata } from "@/lib/seo";

const dict = getDictionary("en");

export const metadata: Metadata = buildMetadata({
  locale: "en",
  route: "support",
  title: `${dict.support.title} — Nestory`,
  description: dict.support.intro,
});

export default function Page() {
  return <SupportPage dict={dict} locale="en" />;
}
