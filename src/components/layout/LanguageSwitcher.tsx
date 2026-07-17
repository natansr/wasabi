import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '../../domain/language';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const changeLanguage = (language: SupportedLanguage) => void i18n.changeLanguage(language);

  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
      <span className="sr-only">{t('language.label')}</span>
      <span aria-hidden="true">🌐</span>
      <select aria-label={t('language.label')} value={i18n.resolvedLanguage ?? 'en-US'} onChange={(event) => changeLanguage(event.target.value as SupportedLanguage)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm">
        <option value="pt-BR">{t('language.portuguese')}</option>
        <option value="en-US">{t('language.english')}</option>
      </select>
    </label>
  );
}
