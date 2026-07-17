import { useTranslation } from 'react-i18next';
import type { BibliographicRecord } from '../../domain/bibliographicRecord';

export function ImportSummary({ records, duplicatesRemoved }: { records: BibliographicRecord[]; duplicatesRemoved: number }) {
  const { t } = useTranslation(); const missing = { title: records.filter((item) => !item.title).length, authors: records.filter((item) => !item.authors.length).length, year: records.filter((item) => !item.year).length, references: records.filter((item) => !item.references.length).length };
  const metrics = [{ key: 'records', value: records.length }, { key: 'duplicates', value: duplicatesRemoved }, ...Object.entries(missing).map(([key, value]) => ({ key: `missing${key[0].toUpperCase()}${key.slice(1)}`, value }))];
  return <div className="grid gap-3 sm:grid-cols-3">{metrics.map((metric) => <div key={metric.key} className="rounded-xl bg-slate-100 p-4"><strong className="block text-2xl text-wasabi-900">{metric.value}</strong><span className="text-sm text-slate-600">{t(`import.summary.${metric.key}`)}</span></div>)}</div>;
}
