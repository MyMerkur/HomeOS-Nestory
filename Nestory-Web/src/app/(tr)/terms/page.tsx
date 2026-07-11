import type { Metadata } from "next";
import { TermsPage } from "@/components/pages/TermsPage";
import { getDictionary } from "@/content";
import { buildMetadata } from "@/lib/seo";

const dict = getDictionary("tr");

export const metadata: Metadata = buildMetadata({
  locale: "tr",
  route: "terms",
  title: `${dict.terms.title} — Nestory`,
  description: dict.terms.body.slice(0, 150),
});

export default function Page() {
  return <TermsPage dict={dict} locale="tr" />;
}
