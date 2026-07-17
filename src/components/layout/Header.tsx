import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Link } from 'react-router-dom';

export function Header() {
  const { t } = useTranslation();
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <Link to="/" className="shrink-0 no-underline">
          <img
            src="./wasabi-logo.png"
            alt={t('app.name')}
            width="584"
            height="156"
            className="h-9 w-auto sm:h-11"
          />
        </Link>
        <div className="flex items-center gap-4 font-sans"><Link to="/projects" className="hidden text-sm font-semibold text-slate-600 sm:block">{t('nav.projects')}</Link><Link to="/settings" className="hidden text-sm font-semibold text-slate-600 sm:block">{t('nav.settings')}</Link><LanguageSwitcher /></div>
      </div>
    </header>
  );
}
