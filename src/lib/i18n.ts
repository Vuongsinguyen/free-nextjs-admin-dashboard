export type Locale = 'en' | 'vi' | 'ja';

export const locales: Locale[] = ['en', 'vi', 'ja'];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  ja: 'JP (日本語)',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  vi: '🇻🇳',
  ja: '🇯🇵',
};