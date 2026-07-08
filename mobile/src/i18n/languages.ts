export const SUPPORTED_LANGUAGES = ['en', 'tr', 'de', 'fr', 'es', 'it', 'cs', 'pt'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

// Native names are proper nouns and stay identical across every locale file.
export const LANGUAGE_NATIVE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  tr: 'Türkçe',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  cs: 'Čeština',
  pt: 'Português',
};

export function isSupportedLanguage(code: string): code is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(code);
}
