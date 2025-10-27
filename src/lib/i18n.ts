export type Locale = 'en' | 'vi' | 'ja' | 'ko' | 'zh';

export const locales: Locale[] = ['en', 'vi', 'ja', 'ko', 'zh'];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  ja: 'Tiếng Nhật',
  ko: 'Tiếng Hàn',
  zh: 'Tiếng Trung',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  vi: '🇻🇳',
  ja: '🇯🇵',
  ko: '🇰🇷',
  zh: '🇨🇳',
};