import type { BibliographicRecord, DuplicateConfidence, DuplicateGroup } from '../../domain/bibliographicRecord';
import { createId } from '../../utils/ids';
import { normalizeAuthor } from './normalizeAuthor';
import { normalizeDoi } from './normalizeDoi';
import { normalizeText } from './normalizeText';

export interface DeduplicationResult { records: BibliographicRecord[]; duplicateGroups: DuplicateGroup[]; duplicatesRemoved: number; }

function identity(record: BibliographicRecord): { key?: string; confidence: DuplicateConfidence; matchedBy: DuplicateGroup['matchedBy'] } {
  const doi = normalizeDoi(record.doi);
  if (doi) return { key: `doi:${doi}`, confidence: 'high', matchedBy: 'doi' };
  const title = normalizeText(record.title); const firstAuthor = record.authors[0] ? normalizeAuthor(record.authors[0]) : '';
  if (title && record.year && firstAuthor) return { key: `fallback:${title}|${record.year}|${firstAuthor}`, confidence: 'medium', matchedBy: 'title-year-author' };
  return { confidence: 'low', matchedBy: 'title-year-author' };
}

export function completenessScore(record: BibliographicRecord) {
  return Number(Boolean(record.doi)) * 8 + Number(Boolean(record.abstract)) * 6 + Number(record.references.length > 0) * 5 + Number(record.keywords.length > 0) * 4 + Number(record.citationCount != null) * 3 + Number(Boolean(record.affiliations?.length)) * 2 + Number(Boolean(record.countries?.length)) * 2 + Number(Boolean(record.institutions?.length)) * 2 + Object.values(record).filter((value) => value != null && value !== '').length / 100;
}

export function deduplicateRecords(records: BibliographicRecord[]): DeduplicationResult {
  const unique: BibliographicRecord[] = []; const positions = new Map<string, number>(); const grouped = new Map<string, { ids: string[]; confidence: DuplicateConfidence; matchedBy: DuplicateGroup['matchedBy'] }>();
  for (const record of records) {
    const match = identity(record);
    if (!match.key) { unique.push(record); continue; }
    const position = positions.get(match.key);
    if (position == null) { positions.set(match.key, unique.length); unique.push(record); grouped.set(match.key, { ids: [record.id], confidence: match.confidence, matchedBy: match.matchedBy }); continue; }
    grouped.get(match.key)!.ids.push(record.id);
    if (completenessScore(record) > completenessScore(unique[position])) unique[position] = record;
  }
  const duplicateGroups = [...grouped.values()].filter((group) => group.ids.length > 1).map((group) => {
    const retained = unique.find((record) => group.ids.includes(record.id));
    return { id: createId('duplicate'), recordIds: group.ids, retainedRecordId: retained!.id, confidence: group.confidence, matchedBy: group.matchedBy };
  });
  return { records: unique, duplicateGroups, duplicatesRemoved: records.length - unique.length };
}
