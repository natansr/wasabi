import { useTranslation } from 'react-i18next';
import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import { doiLink, recordLink } from '../../utils/bibliographicLink';

export function RecordsPreviewTable({ records }: { records: BibliographicRecord[] }) {
  const { t } = useTranslation();
  return <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[720px] border-collapse bg-white text-left text-sm"><thead className="bg-slate-100"><tr>{['title', 'authors', 'year', 'source', 'doi', 'keywords'].map((key) => <th key={key} className="px-4 py-3">{t(`import.preview.${key}`)}</th>)}</tr></thead><tbody>{records.slice(0, 10).map((record) => { const link = recordLink(record), doi = doiLink(record.doi); return <tr key={record.id} className="border-t border-slate-100"><td className="max-w-xs px-4 py-3 font-medium">{link ? <a href={link} target="_blank" rel="noreferrer" className="text-wasabi-700 underline underline-offset-2">{record.title || t('dashboard.corpus.openRecord')}</a> : record.title || '—'}</td><td className="px-4 py-3">{record.authors.join('; ') || '—'}</td><td className="px-4 py-3">{record.year ?? '—'}</td><td className="px-4 py-3">{record.sourceTitle ?? '—'}</td><td className="px-4 py-3">{doi ? <a href={doi} target="_blank" rel="noreferrer" className="font-sans font-semibold text-wasabi-700">{record.doi} ↗</a> : record.doi ?? '—'}</td><td className="px-4 py-3">{record.keywords.join('; ') || '—'}</td></tr>; })}</tbody></table></div>;
}
