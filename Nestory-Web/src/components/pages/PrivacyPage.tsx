import type { Dictionary, Locale } from "@/content/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function PrivacyPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const p = dict.privacy;

  return (
    <>
      <Header dict={dict} locale={locale} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{p.title}</h1>
        <p className="mt-2 text-sm text-brand-muted">{p.updated}</p>
        <p className="mt-6 text-brand-muted">{p.intro}</p>

        <div className="mt-10 space-y-8">
          {p.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-semibold text-foreground">{section.heading}</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{section.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-brand-muted">{p.contact}</p>
      </main>
      <Footer dict={dict} locale={locale} />
    </>
  );
}
