import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '../../domain/language';
import type { TemacProject } from '../../domain/temacProject';
import { downloadText } from '../../services/export/exportFile';
import { exportMarkdownReport } from '../../services/export/exportMarkdownReport';
import { descriptiveAnalysis } from '../../services/analysis/descriptiveAnalysis';
import {
  exportRankedCsv,
  exportRecordsCsv,
} from '../../services/export/exportCsv';
import { ReportLanguageSelector } from './ReportLanguageSelector';
import { saveActiveProject } from '../../services/storage/projectStorage';
import { downloadPdfReport, markdownToPlainText } from '../../services/export/exportPdfReport';

export function ExportPanel({
  project,
  onSaved,
}: {
  project: TemacProject;
  onSaved: (project: TemacProject) => void;
}) {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<SupportedLanguage>(
    i18n.resolvedLanguage === 'pt-BR' ? 'pt-BR' : 'en-US',
  );
  const [synthesis, setSynthesis] = useState(project.reviewSynthesis ?? '');
  const saveSynthesis = async () => {
    if (synthesis === (project.reviewSynthesis ?? '')) return;
    const updated = await saveActiveProject({
      ...project,
      reviewSynthesis: synthesis,
    });
    onSaved(updated);
  };
  const analysis = descriptiveAnalysis(
    project.importedRecords,
    project.deduplicatedRecords,
  );
  const baseName =
    project.title
      .trim()
      .replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase() || 'project';
  const report = () => {
    const reportT = i18n.getFixedT(language);
    return exportMarkdownReport(
      project,
      reportT,
      synthesis,
      language,
    );
  };
  const reportName = `${baseName}-${language}`;
  const tableExport = (
    name: string,
    items: Array<{ label: string; value: number }>,
  ) =>
    downloadText(
      exportRankedCsv(
        items,
        t('export.columns.item'),
        t('export.columns.value'),
      ),
      `${baseName}-${name}.csv`,
      'text/csv;charset=utf-8',
    );
  const secondary =
    'rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700';
  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-black text-wasabi-900">
        {t('export.dataTitle')}
      </h2>
      <p className="mt-2 text-slate-600">{t('export.dataDescription')}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          className={secondary}
          onClick={() =>
            downloadText(
              exportRecordsCsv(project.deduplicatedRecords),
              `${baseName}-corpus.csv`,
              'text/csv;charset=utf-8',
            )
          }
        >
          {t('export.corpusCsv')}
        </button>
        <button
          className={secondary}
          onClick={() =>
            downloadText(
              JSON.stringify(project.deduplicatedRecords, null, 2),
              `${baseName}-corpus.json`,
              'application/json',
            )
          }
        >
          {t('export.corpusJson')}
        </button>
        <button
          className={secondary}
          onClick={() => tableExport('authors', analysis.topAuthors)}
        >
          {t('export.authorsCsv')}
        </button>
        <button
          className={secondary}
          onClick={() => tableExport('sources', analysis.topSources)}
        >
          {t('export.sourcesCsv')}
        </button>
        <button
          className={secondary}
          onClick={() => tableExport('keywords', analysis.topKeywords)}
        >
          {t('export.keywordsCsv')}
        </button>
        <button
          className={secondary}
          onClick={() => tableExport('references', analysis.topReferences)}
        >
          {t('export.referencesCsv')}
        </button>
      </div>
      <div className="my-8 border-t border-slate-200" />
      <h2 className="text-2xl font-black text-wasabi-900">
        {t('export.reportTitle')}
      </h2>
      <p className="mt-2 text-slate-600">{t('export.reportDescription')}</p>
      <div className="mt-5 grid gap-5">
        <ReportLanguageSelector value={language} onChange={setLanguage} />
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          <span>{t('export.synthesis')}</span>
          <textarea
            rows={6}
            value={synthesis}
            onChange={(event) => setSynthesis(event.target.value)}
            onBlur={() => void saveSynthesis()}
            placeholder={t('export.synthesisPlaceholder')}
            className="rounded-xl border border-slate-200 px-4 py-3 font-normal"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => downloadText(markdownToPlainText(report()), `${reportName}.txt`, 'text/plain;charset=utf-8')} className={secondary}>{t('export.downloadTxt')}</button>
          <button onClick={() => downloadText(report(), `${reportName}.md`, 'text/markdown;charset=utf-8')} className={secondary}>{t('export.downloadMarkdown')}</button>
          <button onClick={() => void downloadPdfReport(report(), `${reportName}.pdf`)} className="rounded-xl bg-wasabi-700 px-6 py-3 font-semibold text-white">{t('export.downloadPdf')}</button>
        </div>
      </div>
    </section>
  );
}
