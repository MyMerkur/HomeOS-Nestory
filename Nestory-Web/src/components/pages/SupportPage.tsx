import type { Dictionary, Locale } from "@/content/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function SupportPage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const s = dict.support;

  return (
    <>
      <Header dict={dict} locale={locale} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{s.title}</h1>
        <p className="mt-4 text-brand-muted">{s.intro}</p>

        <div className="mt-10 space-y-4">
          {s.faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-black/5 bg-white/60 p-5 open:bg-white"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:content-none">
                {item.q}
              </summary>
              <p className="mt-3 text-sm text-brand-muted">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-brand-green px-6 py-8 text-brand-cream">
          <h2 className="text-lg font-semibold">{s.contactTitle}</h2>
          <p className="mt-2 text-sm text-brand-cream/80">{s.contactBody}</p>
          <a href="mailto:support@nestoryhomekit.com" className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">
            support@nestoryhomekit.com
          </a>
        </div>
      </main>
      <Footer dict={dict} locale={locale} />
    </>
  );
}
