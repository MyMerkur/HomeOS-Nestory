"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dictionary, Locale } from "@/content/types";
import { routes, locales, localeNames } from "@/content/routes";

export function Header({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const r = routes[locale];

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-brand-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={r.home} className="flex items-center gap-2 text-lg font-semibold tracking-tight text-brand-green-dark">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green text-brand-cream">
            N
          </span>
          Nestory
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 md:flex">
          <Link href={`${r.home}#features`} className="transition-colors hover:text-brand-green-dark">
            {dict.nav.features}
          </Link>
          <Link href={r.support} className="transition-colors hover:text-brand-green-dark">
            {dict.nav.support}
          </Link>
          <Link href={r.privacy} className="transition-colors hover:text-brand-green-dark">
            {dict.nav.privacy}
          </Link>
          <LanguageSwitcher locale={locale} />
        </nav>

        <button
          aria-label="Menu"
          className="flex h-9 w-9 items-center justify-center rounded-md md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className="h-0.5 w-5 bg-foreground" />
            <span className="h-0.5 w-5 bg-foreground" />
            <span className="h-0.5 w-5 bg-foreground" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/5 px-6 py-4 text-sm font-medium md:hidden">
          <Link href={`${r.home}#features`} className="py-2" onClick={() => setOpen(false)}>
            {dict.nav.features}
          </Link>
          <Link href={r.support} className="py-2" onClick={() => setOpen(false)}>
            {dict.nav.support}
          </Link>
          <Link href={r.privacy} className="py-2" onClick={() => setOpen(false)}>
            {dict.nav.privacy}
          </Link>
          <div className="pt-2">
            <LanguageSwitcher locale={locale} />
          </div>
        </nav>
      )}
    </header>
  );
}

function LanguageSwitcher({ locale }: { locale: Locale }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-black/10 p-1">
      {locales.map((l) => (
        <Link
          key={l}
          href={routes[l].home}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
            l === locale
              ? "bg-brand-green text-brand-cream"
              : "text-foreground/60 hover:text-brand-green-dark"
          }`}
        >
          {localeNames[l].slice(0, 2).toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
