import type { Metadata } from "next";
import { TermsPage } from "@/components/pages/TermsPage";
import { getDictionary } from "@/content";
import { buildMetadata } from "@/lib/seo";

const dict = getDictionary("cs");

export const metadata: Metadata = buildMetadata({
  locale: "cs",
  route: "terms",
  title: `${dict.terms.title} — Nestory`,
  description: dict.terms.body.slice(0, 150),
});

export default function Page() {
  return <TermsPage dict={dict} locale="cs" />;
}
