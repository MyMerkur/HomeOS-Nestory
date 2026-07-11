import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { getDictionary } from "@/content";
import { buildMetadata } from "@/lib/seo";

const dict = getDictionary("cs");

export const metadata: Metadata = buildMetadata({
  locale: "cs",
  route: "home",
  title: dict.meta.title,
  description: dict.meta.description,
});

export default function Page() {
  return <HomePage dict={dict} locale="cs" />;
}
