import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './locales/en.json';
import tr from './locales/tr.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import it from './locales/it.json';
import cs from './locales/cs.json';
import pt from './locales/pt.json';
import { getStoredLanguage } from '../services/languageStorage';
import { FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES, type SupportedLanguage } from './languages';

export { SUPPORTED_LANGUAGES, FALLBACK_LANGUAGE, isSupportedLanguage } from './languages';
export type { SupportedLanguage } from './languages';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
  it: { translation: it },
  cs: { translation: cs },
  pt: { translation: pt },
};

function detectDeviceLanguage(): SupportedLanguage {
  const bestTag = RNLocalize.findBestLanguageTag(SUPPORTED_LANGUAGES);
  return bestTag?.languageTag ?? FALLBACK_LANGUAGE;
}

export async function initI18n(): Promise<void> {
  const storedLanguage = await getStoredLanguage();
  const initialLanguage = storedLanguage ?? detectDeviceLanguage();

  await i18next.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: { escapeValue: false },
  });
}

export default i18next;
