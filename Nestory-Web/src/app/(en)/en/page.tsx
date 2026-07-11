import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { getDictionary } from "@/content";
import { buildMetadata } from "@/lib/seo";

const dict = getDictionary("en");

export const metadata: Metadata = buildMetadata({
  locale: "en",
  route: "home",
  title: dict.meta.title,
  description: dict.meta.description,
});

export default function Page() {
  return <HomePage dict={dict} locale="en" />;
}
