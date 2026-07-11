import type { Metadata } from "next";
import { SupportPage } from "@/components/pages/SupportPage";
import { getDictionary } from "@/content";
import { buildMetadata } from "@/lib/seo";

const dict = getDictionary("cs");

export const metadata: Metadata = buildMetadata({
  locale: "cs",
  route: "support",
  title: `${dict.support.title} — Nestory`,
  description: dict.support.intro,
});

export default function Page() {
  return <SupportPage dict={dict} locale="cs" />;
}
