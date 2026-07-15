import type { Dictionary, Locale } from "@/content/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function AccountDeletionPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const d = dict.accountDeletion;

  return (
    <>
      <Header dict={dict} locale={locale} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{d.title}</h1>
        <p className="mt-6 text-brand-muted">{d.intro}</p>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">{d.stepsTitle}</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-brand-muted">
            {d.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">{d.dataRemovedTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">{d.dataRemoved}</p>
        </div>

        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-sm font-semibold text-amber-900">{d.blockedTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-900/80">{d.blocked}</p>
        </div>

        <p className="mt-10 text-sm text-brand-muted">{d.contact}</p>
      </main>
      <Footer dict={dict} locale={locale} />
    </>
  );
}
