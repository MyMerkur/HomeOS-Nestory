import type { Metadata } from "next";
import { AccountDeletionPage } from "@/components/pages/AccountDeletionPage";
import { getDictionary } from "@/content";
import { buildMetadata } from "@/lib/seo";

const dict = getDictionary("cs");

export const metadata: Metadata = buildMetadata({
  locale: "cs",
  route: "accountDeletion",
  title: `${dict.accountDeletion.title} — Nestory`,
  description: dict.accountDeletion.intro,
});

export default function Page() {
  return <AccountDeletionPage dict={dict} locale="cs" />;
}
