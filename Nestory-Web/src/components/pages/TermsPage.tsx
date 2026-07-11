import type { Dictionary, Locale } from "@/content/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function TermsPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.terms;

  return (
    <>
      <Header dict={dict} locale={locale} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{t.title}</h1>
        <p className="mt-2 text-sm text-brand-muted">{t.updated}</p>
        <p className="mt-6 text-sm leading-relaxed text-brand-muted">{t.body}</p>
        <p className="mt-8 text-sm text-brand-muted">{t.contact}</p>
      </main>
      <Footer dict={dict} locale={locale} />
    </>
  );
}
