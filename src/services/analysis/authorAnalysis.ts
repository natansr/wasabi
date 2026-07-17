import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import type { RankedMetric } from '../../domain/analysisResult';
import { rank } from './analysisHelpers';

export function analyzeAuthors(records: BibliographicRecord[], limit = 10) { return rank(records.flatMap((record) => record.authors), limit); }
export function analyzeAuthorsByCitations(records: BibliographicRecord[], limit = 10): RankedMetric[] {
  const citations = new Map<string, number>();
  for (const record of records) for (const author of record.authors) citations.set(author, (citations.get(author) ?? 0) + (record.citationCount ?? 0));
  return [...citations].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label)).slice(0, limit);
}
