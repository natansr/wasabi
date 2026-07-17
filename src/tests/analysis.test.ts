import { describe, expect, it } from 'vitest';
import type { BibliographicRecord } from '../domain/bibliographicRecord';
import { descriptiveAnalysis } from '../services/analysis/descriptiveAnalysis';

const record = (id: string, values: Partial<BibliographicRecord>): BibliographicRecord => ({ id, title: `Record ${id}`, authors: [], keywords: [], references: [], raw: {}, ...values });

describe('descriptive bibliometric analysis', () => {
  const imported = [
    record('a', { year: 2022, authors: ['Ana', 'Bob'], sourceTitle: 'Journal A', documentType: 'Article', keywords: ['TEMAC', 'Networks'], references: ['Ref 1', 'Ref 2'], citationCount: 4, countries: ['Brazil'], institutions: ['UEG'] }),
    record('b', { year: 2023, authors: ['Ana'], sourceTitle: 'Journal B', documentType: 'Review', keywords: ['TEMAC'], references: ['Ref 1'], citationCount: 6, countries: ['Brazil'], institutions: ['UEG'] }),
    record('duplicate', { year: 2023 }),
  ];
  const result = descriptiveAnalysis(imported, imported.slice(0, 2));

  it('calculates corpus totals and temporal coverage', () => {
    expect(result).toMatchObject({ totalImported: 3, totalDeduplicated: 2, duplicatesRemoved: 1, totalAuthors: 2, totalSources: 2, totalKeywords: 2, totalReferences: 2, totalCitations: 10, startYear: 2022, endYear: 2023 });
  });
  it('ranks entities and aggregates annual values', () => {
    expect(result.publicationsByYear).toEqual([{ year: 2022, value: 1 }, { year: 2023, value: 1 }]);
    expect(result.citationsByYear).toEqual([{ year: 2022, value: 4 }, { year: 2023, value: 6 }]);
    expect(result.topAuthors[0]).toEqual({ label: 'Ana', value: 2 });
    expect(result.topReferences[0]).toEqual({ label: 'Ref 1', value: 2 });
  });
});
