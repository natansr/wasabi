import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TemacProject } from '../../domain/temacProject';
import { descriptiveAnalysis } from '../../services/analysis/descriptiveAnalysis';
import { PublicationsByYearChart } from '../charts/PublicationsByYearChart';
import { CitationsByYearChart } from '../charts/CitationsByYearChart';
import { DocumentTypesChart } from '../charts/DocumentTypesChart';
import { TopAuthorsChart } from '../charts/TopAuthorsChart';
import { TopKeywordsChart } from '../charts/TopKeywordsChart';
import { TopSourcesChart } from '../charts/TopSourcesChart';
import { MetricCard } from './MetricCard';
import { RankedTable } from './RankedTable';
import { CorpusTable } from './CorpusTable';
import { TermEvolutionChart } from '../charts/TermEvolutionChart';
import { termEvolutionAnalysis } from '../../services/analysis/termEvolutionAnalysis';
import { TopCountriesChart } from '../charts/TopCountriesChart';
import { TopInstitutionsChart } from '../charts/TopInstitutionsChart';
import { TopReferencesChart } from '../charts/TopReferencesChart';
import { SankeyChart } from '../charts/SankeyChart';
import { sankeyAnalysis } from '../../services/analysis/sankeyAnalysis';

export function DashboardPage({ project }: { project: TemacProject }) {
  const { t } = useTranslation();
  const analysis = useMemo(
    () =>
      descriptiveAnalysis(project.importedRecords, project.deduplicatedRecords),
    [project.importedRecords, project.deduplicatedRecords],
  );
  const termEvolution = useMemo(
    () => termEvolutionAnalysis(project.deduplicatedRecords),
    [project.deduplicatedRecords],
  );
  const sankey = useMemo(
    () => sankeyAnalysis(project.deduplicatedRecords),
    [project.deduplicatedRecords],
  );
  const metrics = [
    { key: 'imported', value: analysis.totalImported },
    { key: 'deduplicated', value: analysis.totalDeduplicated },
    { key: 'duplicates', value: analysis.duplicatesRemoved },
    { key: 'authors', value: analysis.totalAuthors },
    { key: 'sources', value: analysis.totalSources },
    { key: 'keywords', value: analysis.totalKeywords },
    { key: 'references', value: analysis.totalReferences },
    { key: 'citations', value: analysis.totalCitations },
    {
      key: 'timeSpan',
      value:
        analysis.startYear && analysis.endYear
          ? `${analysis.startYear}–${analysis.endYear}`
          : '—',
    },
  ];
  const charts = [
    {
      key: 'publicationsByYear',
      component: <PublicationsByYearChart data={analysis.publicationsByYear} />,
    },
    {
      key: 'citationsByYear',
      component: <CitationsByYearChart data={analysis.citationsByYear} />,
    },
    {
      key: 'documentTypes',
      component: <DocumentTypesChart data={analysis.documentTypes} />,
    },
    {
      key: 'topSources',
      component: <TopSourcesChart data={analysis.topSources} />,
    },
    {
      key: 'topAuthors',
      component: <TopAuthorsChart data={analysis.topAuthors} />,
    },
    {
      key: 'topKeywords',
      component: <TopKeywordsChart data={analysis.topKeywords} />,
    },
    ...(analysis.topCountries.length ? [{ key: 'topCountries', component: <TopCountriesChart data={analysis.topCountries} /> }] : []),
    ...(analysis.topInstitutions.length ? [{ key: 'topInstitutions', component: <TopInstitutionsChart data={analysis.topInstitutions} /> }] : []),
    ...(analysis.topReferences.length ? [{ key: 'topReferences', component: <TopReferencesChart data={analysis.topReferences} /> }] : []),
  ];
  const tables = [
    { key: 'authorsByCitations', data: analysis.topAuthorsByCitations },
    { key: 'countries', data: analysis.topCountries },
    { key: 'institutions', data: analysis.topInstitutions },
    { key: 'references', data: analysis.topReferences },
  ].filter((table) => table.data.length);
  return (
    <section className="mt-10 border-t border-slate-200 pt-10">
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-widest text-wasabi-500">
          {t('dashboard.eyebrow')}
        </p>
        <h2 className="mt-2 text-3xl font-black text-wasabi-900">
          {t('dashboard.title')}
        </h2>
        <p className="mt-2 text-slate-600">{t('dashboard.description')}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.key}
            label={t(`dashboard.metrics.${metric.key}`)}
            value={metric.value}
          />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {charts.map((chart) => (
          <article
            key={chart.key}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h3 className="px-2 pt-2 text-lg font-bold text-slate-800">
              {t(`dashboard.${chart.key}`)}
            </h3>
            {chart.component}
          </article>
        ))}
      </div>
      {termEvolution.length > 0 && (
        <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="px-2 pt-2 text-lg font-bold text-slate-800">
            {t('dashboard.termEvolution')}
          </h3>
          <TermEvolutionChart data={termEvolution} />
        </article>
      )}
      {sankey.links.length > 0 && (
        <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="px-2 pt-2 text-lg font-bold text-slate-800">
            {t('dashboard.sankey')}
          </h3>
          <SankeyChart data={sankey} />
        </article>
      )}
      {tables.length > 0 && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {tables.map((table) => (
            <article
              key={table.key}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <h3 className="mb-4 text-lg font-bold text-slate-800">
                {t(`dashboard.tables.${table.key}`)}
              </h3>
              <RankedTable
                data={table.data}
                label={t('dashboard.tables.item')}
                valueLabel={t('dashboard.tables.value')}
              />
            </article>
          ))}
        </div>
      )}
      <CorpusTable records={project.deduplicatedRecords} />
    </section>
  );
}
