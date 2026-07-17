import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './locales/en-US.json';
import ptBR from './locales/pt-BR.json';
import type { SupportedLanguage } from '../domain/language';

export const LANGUAGE_STORAGE_KEY = 'wasabi.language';

function initialLanguage(): SupportedLanguage {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved === 'pt-BR' || saved === 'en-US') return saved;
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en-US';
}

void i18n.use(initReactI18next).init({
  resources: { 'pt-BR': { translation: ptBR }, 'en-US': { translation: enUS } },
  lng: initialLanguage(),
  fallbackLng: 'en-US',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (language) => {
  if (language === 'pt-BR' || language === 'en-US') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }
});

document.documentElement.lang = i18n.language;
export default i18n;
