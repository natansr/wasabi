import { useTranslation } from 'react-i18next';
import { Header } from '../layout/Header';
import { PageContainer } from '../layout/PageContainer';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import sampleCsv from '../../data/examples/sample-records.csv?raw';
import { parseCsv } from '../../services/parsers/parseCsv';
import { deduplicateRecords } from '../../services/normalization/deduplicateRecords';
import { descriptiveAnalysis } from '../../services/analysis/descriptiveAnalysis';
import { createProject, saveActiveProject } from '../../services/storage/projectStorage';
import { createId } from '../../utils/ids';

const stages = ['preparation', 'interrelation', 'evidence'] as const;
const guideSteps = ['create', 'import', 'review', 'export'] as const;
export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate(); const [loadingExample, setLoadingExample] = useState(false);
  const loadExample = async () => { setLoadingExample(true); const parsed = parseCsv(sampleCsv); const deduplicated = deduplicateRecords(parsed.records); const now = new Date().toISOString(); const project = { id: createId('project'), title: t('sample.title'), objective: t('sample.objective'), researchQuestion: t('sample.question'), descriptors: ['bibliometrics', 'scientific mapping', 'TEMAC'], searchStrings: ['TITLE-ABS-KEY ( bibliometrics OR "scientific mapping" )'], databases: ['Scopus'], startYear: 2021, endYear: 2026, knowledgeAreas: [t('sample.area')], inclusionCriteria: [t('sample.inclusion')], exclusionCriteria: [t('sample.exclusion')], methodologicalNotes: t('sample.notes'), importedRecords: parsed.records, deduplicatedRecords: deduplicated.records, duplicateGroups: deduplicated.duplicateGroups, analysisResults: descriptiveAnalysis(parsed.records, deduplicated.records), preferredLanguage: (document.documentElement.lang === 'pt-BR' ? 'pt-BR' : 'en-US') as 'pt-BR' | 'en-US', createdAt: now, updatedAt: now, appVersion: '0.1.0' }; await createProject(project); await saveActiveProject(project); navigate(`/projects/${project.id}`); };
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#e1eee6,_transparent_34%)]">
      <Header />
      <PageContainer>
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-wasabi-500">{t('home.eyebrow')}</p>
            <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-tight text-wasabi-900 sm:text-6xl">{t('app.name')}</h1>
            <p className="mt-4 max-w-2xl text-xl font-semibold leading-relaxed text-slate-700">{t('app.subtitle')}</p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{t('home.description')}</p>
            <div className="mt-9 flex flex-wrap gap-3 font-sans">
              <Link to="/projects/new" className="rounded-xl bg-wasabi-700 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-wasabi-900">{t('home.newProject')}</Link>
              <Link to="/projects" className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:border-wasabi-300 hover:text-wasabi-700">{t('home.openProject')}</Link>
              <Link to="/projects" className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:border-wasabi-300 hover:text-wasabi-700">{t('home.importProject')}</Link>
              <button type="button" disabled={loadingExample} onClick={() => void loadExample()} className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm disabled:opacity-60">{loadingExample ? t('common.loading') : t('home.loadExample')}</button>
            </div>
          </div>
          <aside className="self-center rounded-3xl border border-white bg-white/85 p-6 shadow-soft sm:p-8">
            <h2 className="text-2xl font-bold text-wasabi-900">{t('home.guideTitle')}</h2>
            <p className="mt-2 leading-7 text-slate-600">{t('home.guideDescription')}</p>
            <ol className="mt-7 space-y-5">
              {guideSteps.map((step, index) => <li key={step} className="flex gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-wasabi-100 font-sans font-bold text-wasabi-700">{index + 1}</span><div><h3 className="font-bold text-slate-800">{t(`home.guide.${step}.title`)}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{t(`home.guide.${step}.description`)}</p></div></li>)}
            </ol>
          </aside>
        </section>
        <section className="border-y border-wasabi-100 bg-white px-5 py-14"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><h2 className="text-3xl font-bold text-wasabi-900">{t('home.temacTitle')}</h2><p className="mt-3 text-lg leading-8 text-slate-600">{t('home.temacDescription')}</p><a href="https://www.pesquisatemac.com" target="_blank" rel="noreferrer" className="mt-4 inline-block font-sans font-semibold text-wasabi-700 underline decoration-wasabi-300 underline-offset-4">{t('home.temacLink')}</a></div><div className="mt-9 grid gap-5 md:grid-cols-3">{stages.map((stage, index) => <article key={stage} className="rounded-2xl border border-slate-200 p-5"><p className="font-sans text-sm font-bold text-wasabi-500">{index + 1}</p><h3 className="mt-2 text-xl font-bold text-slate-800">{t(`temac.stage.${stage}`)}</h3><p className="mt-2 leading-7 text-slate-600">{t(`temac.stage.${stage}Description`)}</p></article>)}</div></div></section>
      </PageContainer>
      <footer className="border-t border-slate-200 bg-slate-50 px-5 py-6 font-sans text-sm text-slate-600">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
          <span>© 2026 Wasabi</span>
          <span aria-hidden="true">·</span>
          <span>{t('home.footer.by')}</span>
          <span aria-hidden="true">·</span>
          <span>{t('home.footer.with')}</span>
          <span aria-hidden="true">·</span>
          <a href="https://github.com/natansr/wasabi" target="_blank" rel="noreferrer" className="font-semibold text-wasabi-700 underline decoration-wasabi-300 underline-offset-4">GitHub: natansr/wasabi ↗</a>
        </div>
      </footer>
    </div>
  );
}
