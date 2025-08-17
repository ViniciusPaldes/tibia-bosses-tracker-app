import * as Localization from 'expo-localization';
import i18n, { type InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { MMKV } from 'react-native-mmkv';

import en from '../../locales/en/common.json';
import es from '../../locales/es/common.json';
import pl from '../../locales/pl/common.json';
import ptBR from '../../locales/pt-BR/common.json';

const storage = new MMKV({ id: 'i18n' });
const LANG_KEY = 'lang';

const resources = {
  en: { common: en },
  'pt-BR': { common: ptBR },
  es: { common: es },
  pl: { common: pl },
} as const;

function normalize(langTag: string | undefined): keyof typeof resources {
  if (!langTag) return 'en';
  const lower = langTag.toLowerCase();
  if (lower.startsWith('pt')) return 'pt-BR';
  if (lower.startsWith('es')) return 'es';
  if (lower.startsWith('pl')) return 'pl';
  return 'en';
}

export async function initI18n(): Promise<void> {
  // 1. persisted
  const persisted = storage.getString(LANG_KEY) as keyof typeof resources | undefined;
  // 2. device
  const device = Localization.getLocales?.()[0]?.languageTag;
  const deviceLang = normalize(device);
  const lng = persisted ?? deviceLang ?? 'en';

  const options: InitOptions = {
    resources,
    lng,
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  };

  await i18n.use(initReactI18next).init(options);
}

export async function changeLanguage(code: keyof typeof resources): Promise<void> {
  await i18n.changeLanguage(code);
  storage.set(LANG_KEY, code);
}

export default i18n;


