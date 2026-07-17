import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import type { YearMetric } from '../../domain/analysisResult';
import { rank } from './analysisHelpers';
export const analyzeReferences = (records: BibliographicRecord[], limit = 10) => rank(records.flatMap((record) => record.references), limit);
export function citationsByPublicationYear(records: BibliographicRecord[]): YearMetric[] { const values = new Map<number, number>(); for (const record of records) if (record.year) values.set(record.year, (values.get(record.year) ?? 0) + (record.citationCount ?? 0)); return [...values].map(([year, value]) => ({ year, value })).sort((a, b) => a.year - b.year); }
