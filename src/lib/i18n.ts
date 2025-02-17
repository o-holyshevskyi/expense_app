import en from '../../locales/en.json';
import uk from '../../locales/uk.json';

export type Locale = 'en' | 'uk';
export type Translations = typeof en | typeof uk; // Automatically derive the type from your `en.json`

const translations: Record<Locale, Translations> = {
  en,
  uk,
};

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.replace(/\[(\d+)\]/g, '.$1').split('.'); // Handle array indices like [0]
  let result: any = translations[locale];

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return `${key}`;
    }
  }

  return typeof result === 'string' ? result : `${key}`;
}

