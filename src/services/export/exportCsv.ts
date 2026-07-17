import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import type { RankedMetric } from '../../domain/analysisResult';

export function escapeCsv(value: unknown) { const text = value == null ? '' : String(value); return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }
export function rowsToCsv(rows: unknown[][]) { return `\ufeff${rows.map((row) => row.map(escapeCsv).join(',')).join('\n')}`; }
export function exportRecordsCsv(records: BibliographicRecord[]) { return rowsToCsv([['id', 'title', 'authors', 'year', 'sourceTitle', 'documentType', 'doi', 'keywords', 'citationCount', 'references', 'databaseSource', 'language', 'url'], ...records.map((record) => [record.id, record.title, record.authors.join('; '), record.year, record.sourceTitle, record.documentType, record.doi, record.keywords.join('; '), record.citationCount, record.references.join('; '), record.databaseSource, record.language, record.url])]); }
export function exportRankedCsv(items: RankedMetric[], labelHeader: string, valueHeader: string) { return rowsToCsv([[labelHeader, valueHeader], ...items.map((item) => [item.label, item.value])]); }
