import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TemacProject } from '../../domain/temacProject';
import type { ParsedRecords } from '../../services/parsers/parseCsv';
import { parseCsv } from '../../services/parsers/parseCsv';
import { detectSourceFormat } from '../../services/parsers/detectSourceFormat';
import type { FieldMapping } from '../../services/parsers/fieldMapping';
import { deduplicateRecords } from '../../services/normalization/deduplicateRecords';
import { saveActiveProject } from '../../services/storage/projectStorage';
import { descriptiveAnalysis } from '../../services/analysis/descriptiveAnalysis';
import { FieldMapper } from './FieldMapper';
import { ImportSummary } from './ImportSummary';
import { RecordsPreviewTable } from './RecordsPreviewTable';

export function UploadArea({
  project,
  onSaved,
}: {
  project: TemacProject;
  onSaved: (project: TemacProject) => void;
}) {
  const { t } = useTranslation();
  const [parsed, setParsed] = useState<ParsedRecords>();
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const duplicates = parsed ? deduplicateRecords(parsed.records) : undefined;
  const read = async (file?: File) => {
    if (!file) return;
    const value = await file.text();
    const detected = detectSourceFormat(file.name, value);
    if (detected !== 'csv') {
      setStatus(t('errors.scopusCsvOnly'));
      return;
    }
    setContent(value);
    setParsed(parseCsv(value));
    setStatus('');
  };
  const remap = (mapping: FieldMapping) => {
    setParsed(parseCsv(content, mapping));
  };
  const save = async () => {
    if (!parsed || !duplicates) return;
    const importedRecords = [...project.importedRecords, ...parsed.records];
    const result = deduplicateRecords(importedRecords);
    const analysisResults = descriptiveAnalysis(
      importedRecords,
      result.records,
    );
    const updated = await saveActiveProject({
      ...project,
      importedRecords,
      deduplicatedRecords: result.records,
      duplicateGroups: result.duplicateGroups,
      analysisResults,
      startYear: project.yearRangeMode === 'automatic' ? analysisResults.startYear : project.startYear,
      endYear: project.yearRangeMode === 'automatic' ? analysisResults.endYear : project.endYear,
    });
    onSaved(updated);
    setStatus(t('success.recordsImported', { count: parsed.records.length }));
  };
  return (
    <section className="grid gap-6">
      <label className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-wasabi-300 bg-wasabi-50 px-6 py-12 text-center">
        <span className="text-lg font-bold text-wasabi-900">
          {t('import.dropTitle')}
        </span>
        <span className="mt-2 text-sm text-slate-600">
          {t('import.formats')}
        </span>
        <input
          className="sr-only"
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => void read(event.target.files?.[0])}
        />
      </label>
      <details className="rounded-2xl border border-slate-200 bg-white p-5">
        <summary className="cursor-pointer font-bold text-wasabi-800">{t('import.scopusHelp.title')}</summary>
        <div className="mt-4 grid gap-5 text-sm leading-6 text-slate-600">
          <p>{t('import.scopusHelp.intro')}</p>
          <ol className="grid gap-4 sm:grid-cols-2">
            <li><strong className="block text-slate-800">1. {t('import.scopusHelp.step1Title')}</strong><span>{t('import.scopusHelp.step1')}</span><img src="./scopus-export-menu.png" alt={t('import.scopusHelp.step1Alt')} className="mt-3 rounded-xl border border-slate-200" /></li>
            <li><strong className="block text-slate-800">2. {t('import.scopusHelp.step2Title')}</strong><span>{t('import.scopusHelp.step2')}</span><img src="./scopus-export-fields.png" alt={t('import.scopusHelp.step2Alt')} className="mt-3 rounded-xl border border-slate-200" /></li>
          </ol>
          <p>{t('import.scopusHelp.fields')}</p>
          <p><a href="https://www.scopus.com" target="_blank" rel="noreferrer" className="font-semibold text-wasabi-700 underline underline-offset-4">{t('import.scopusHelp.openScopus')} ↗</a></p>
          <p className="rounded-lg bg-amber-50 p-3 text-amber-900">{t('import.scopusHelp.onlyScopus')}</p>
        </div>
      </details>
      {status && (
        <p
          role="status"
          className="rounded-xl bg-wasabi-100 p-4 font-semibold text-wasabi-900"
        >
          {status}
        </p>
      )}
      {parsed && duplicates && (
        <>
          <ImportSummary
            records={parsed.records}
            duplicatesRemoved={duplicates.duplicatesRemoved}
          />
          {project.yearRangeMode === 'automatic' && <p className="rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-900">{t('import.detectedPeriod', { start: descriptiveAnalysis(parsed.records, parsed.records).startYear ?? '—', end: descriptiveAnalysis(parsed.records, parsed.records).endYear ?? '—' })}</p>}
          <FieldMapper
            headers={parsed.headers}
            mapping={parsed.mapping}
            onChange={remap}
          />
          {parsed.errors.length > 0 && (
            <p className="rounded-xl bg-amber-50 p-4 text-amber-900">
              {t('import.parseWarnings', { count: parsed.errors.length })}
            </p>
          )}
          <RecordsPreviewTable records={parsed.records} />
          <button
            onClick={() => void save()}
            className="justify-self-start rounded-xl bg-wasabi-700 px-6 py-3 font-semibold text-white"
          >
            {t('import.addToProject')}
          </button>
        </>
      )}
    </section>
  );
}
