import Link from "next/link";
import type { Dictionary, Locale } from "@/content/types";
import { routes, locales, localeNames } from "@/content/routes";

export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const r = routes[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-brand-cream">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold text-brand-green-dark">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-green text-brand-cream text-sm">
                N
              </span>
              Nestory
            </div>
            <p className="mt-3 max-w-xs text-sm text-brand-muted">{dict.footer.tagline}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{dict.footer.productTitle}</h3>
            <ul className="mt-3 space-y-2 text-sm text-brand-muted">
              <li>
                <Link href={`${r.home}#features`} className="hover:text-brand-green-dark">
                  {dict.nav.features}
                </Link>
              </li>
              <li>
                <Link href={r.support} className="hover:text-brand-green-dark">
                  {dict.nav.support}
                </Link>
              </li>
              <li>
                <Link href={r.privacy} className="hover:text-brand-green-dark">
                  {dict.nav.privacy}
                </Link>
              </li>
              <li>
                <Link href={r.terms} className="hover:text-brand-green-dark">
                  {dict.terms.title}
                </Link>
              </li>
              <li>
                <Link href={r.accountDeletion} className="hover:text-brand-green-dark">
                  {dict.accountDeletion.title}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{dict.footer.languageTitle}</h3>
            <ul className="mt-3 space-y-2 text-sm text-brand-muted">
              {locales.map((l) => (
                <li key={l}>
                  <Link
                    href={routes[l].home}
                    className={l === locale ? "font-medium text-brand-green-dark" : "hover:text-brand-green-dark"}
                  >
                    {localeNames[l]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-black/5 pt-6 text-xs text-brand-muted">
          © {year} Nestory. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
