import type { SupportedLanguage } from '../../domain/language';
import type { SupportedTheme } from '../../domain/theme';

const ACTIVE_PROJECT_KEY = 'wasabi.activeProjectId';
const LANGUAGE_KEY = 'wasabi.language';
const THEME_KEY = 'wasabi.theme';

export const localPreferences = {
  getActiveProjectId: () => localStorage.getItem(ACTIVE_PROJECT_KEY),
  setActiveProjectId: (id: string) => localStorage.setItem(ACTIVE_PROJECT_KEY, id),
  clearActiveProjectId: () => localStorage.removeItem(ACTIVE_PROJECT_KEY),
  getLanguage: (): SupportedLanguage | undefined => {
    const value = localStorage.getItem(LANGUAGE_KEY);
    return value === 'pt-BR' || value === 'en-US' ? value : undefined;
  },
  getTheme: (): SupportedTheme | undefined => { const value = localStorage.getItem(THEME_KEY); return value === 'light' || value === 'dark' ? value : undefined; },
  setTheme: (theme: SupportedTheme) => { localStorage.setItem(THEME_KEY, theme); document.documentElement.classList.toggle('dark', theme === 'dark'); },
};
