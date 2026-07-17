import { useTranslation } from 'react-i18next';

export function ScopusCsvHelp() {
  const { t } = useTranslation();

  return (
    <details className="rounded-2xl border border-slate-200 bg-white p-5">
      <summary className="cursor-pointer font-bold text-wasabi-800">
        {t('import.scopusHelp.title')}
      </summary>
      <div className="mt-4 grid gap-5 text-sm leading-6 text-slate-600">
        <p>{t('import.scopusHelp.intro')}</p>
        <ol className="grid gap-4 sm:grid-cols-2">
          <li>
            <strong className="block text-slate-800">1. {t('import.scopusHelp.step1Title')}</strong>
            <span>{t('import.scopusHelp.step1')}</span>
            <img src="./scopus-export-menu.png" alt={t('import.scopusHelp.step1Alt')} className="mt-3 rounded-xl border border-slate-200" />
          </li>
          <li>
            <strong className="block text-slate-800">2. {t('import.scopusHelp.step2Title')}</strong>
            <span>{t('import.scopusHelp.step2')}</span>
            <img src="./scopus-export-fields.png" alt={t('import.scopusHelp.step2Alt')} className="mt-3 rounded-xl border border-slate-200" />
          </li>
        </ol>
        <p>{t('import.scopusHelp.fields')}</p>
        <p>
          <a href="https://www.scopus.com" target="_blank" rel="noreferrer" className="font-semibold text-wasabi-700 underline underline-offset-4">
            {t('import.scopusHelp.openScopus')} ↗
          </a>
        </p>
        <p className="rounded-lg bg-amber-50 p-3 text-amber-900">{t('import.scopusHelp.onlyScopus')}</p>
      </div>
    </details>
  );
}
