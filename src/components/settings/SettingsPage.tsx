import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SupportedTheme } from '../../domain/theme';
import { downloadText } from '../../services/export/exportFile';
import {
  importBackupFromJson,
  importProjectFromJson,
} from '../../services/storage/importWasabiProject';
import {
  clearLocalData,
  listProjects,
} from '../../services/storage/projectStorage';
import { localPreferences } from '../../services/storage/localPreferences';
import { Header } from '../layout/Header';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';

export function SettingsPage() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<SupportedTheme>(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );
  const [message, setMessage] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const changeTheme = (value: SupportedTheme) => {
    setTheme(value);
    localPreferences.setTheme(value);
  };
  const exportAll = async () => {
    const projects = await listProjects();
    downloadText(
      JSON.stringify(
        {
          format: 'wasabi-backup',
          formatVersion: '1.0',
          exportedAt: new Date().toISOString(),
          projects,
        },
        null,
        2,
      ),
      `wasabi-backup-${new Date().toISOString().slice(0, 10)}.json`,
      'application/json',
    );
  };
  const importFile = async (file?: File) => {
    if (!file) return;
    try {
      const format = (JSON.parse(await file.text()) as { format?: string })
        .format;
      if (format === 'wasabi-backup') {
        const projects = await importBackupFromJson(file);
        setMessage(t('success.backupImported', { count: projects.length }));
      } else {
        await importProjectFromJson(file);
        setMessage(t('success.projectImported'));
      }
    } catch {
      setMessage(t('errors.invalidProject'));
    }
  };
  const clear = async () => {
    if (!confirm(t('settings.confirmClear'))) return;
    await clearLocalData();
    setMessage(t('settings.cleared'));
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-wasabi-500">
          {t('app.name')}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-wasabi-900">
          {t('settings.title')}
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          {t('settings.description')}
        </p>
        {message && (
          <p
            role="status"
            className="mt-6 rounded-xl bg-wasabi-100 p-4 font-semibold text-wasabi-900"
          >
            {message}
          </p>
        )}
        <div className="mt-8 grid gap-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-800">
              {t('settings.appearance')}
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <LanguageSwitcher />
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                <span>{t('settings.theme')}</span>
                <select
                  value={theme}
                  onChange={(event) =>
                    changeTheme(event.target.value as SupportedTheme)
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2"
                >
                  <option value="light">{t('settings.light')}</option>
                  <option value="dark">{t('settings.dark')}</option>
                </select>
              </label>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-800">
              {t('settings.data')}
            </h2>
            <p className="mt-2 text-slate-600">
              {t('settings.dataDescription')}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => void exportAll()}
                className="rounded-lg bg-wasabi-700 px-4 py-2 font-semibold text-white"
              >
                {t('settings.exportAll')}
              </button>
              <button
                onClick={() => input.current?.click()}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700"
              >
                {t('settings.importProject')}
              </button>
              <input
                ref={input}
                type="file"
                accept=".json,.wasabi.json"
                className="hidden"
                onChange={(event) => void importFile(event.target.files?.[0])}
              />
              <button
                onClick={() => void clear()}
                className="rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-700"
              >
                {t('settings.clearData')}
              </button>
            </div>
          </section>
          <section className="rounded-2xl border border-wasabi-100 bg-wasabi-50 p-6">
            <h2 className="text-xl font-bold text-wasabi-900">
              {t('settings.privacy')}
            </h2>
            <p className="mt-3 leading-7 text-slate-700">
              {t('privacy.detail')}
            </p>
            <p className="mt-2 leading-7 text-slate-600">
              {t('privacy.localProcessing')}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
