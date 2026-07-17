import { describe, expect, it } from 'vitest';
import type { BibliographicRecord } from '../domain/bibliographicRecord';
import { deduplicateRecords } from '../services/normalization/deduplicateRecords';

const record = (id: string, values: Partial<BibliographicRecord> = {}): BibliographicRecord => ({ id, title: 'Evidence synthesis', authors: ['Ana Silva'], year: 2025, keywords: [], references: [], raw: {}, ...values });

describe('deduplication', () => {
  it('deduplicates normalized DOI and retains the most complete record', () => {
    const result = deduplicateRecords([record('a', { doi: '10.1/ABC' }), record('b', { doi: 'https://doi.org/10.1/abc', abstract: 'More complete', references: ['R1'] })]);
    expect(result.records).toHaveLength(1); expect(result.records[0].id).toBe('b'); expect(result.duplicateGroups[0].confidence).toBe('high');
  });
  it('uses normalized title, year, and first author without DOI', () => {
    const result = deduplicateRecords([record('a'), record('b', { title: 'Évidence synthesis!', authors: ['Ana  Silva'] })]);
    expect(result.duplicatesRemoved).toBe(1); expect(result.duplicateGroups[0].matchedBy).toBe('title-year-author');
  });
  it('keeps incomplete unmatched records', () => expect(deduplicateRecords([record('a', { title: '', authors: [], year: undefined }), record('b', { title: '', authors: [], year: undefined })]).records).toHaveLength(2));
});
