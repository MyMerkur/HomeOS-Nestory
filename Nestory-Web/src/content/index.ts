import type { Dictionary, Locale } from "./types";
import { tr } from "./tr";
import { en } from "./en";
import { cs } from "./cs";

export const dictionaries: Record<Locale, Dictionary> = { tr, en, cs };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export * from "./types";
export * from "./routes";
