import { describe, expect, it } from 'vitest';
import type { BibliographicRecord } from '../domain/bibliographicRecord';
import { termEvolutionAnalysis } from '../services/analysis/termEvolutionAnalysis';

const record = (id: string, year: number, keywords: string[]): BibliographicRecord => ({ id, title: id, authors: [], year, keywords, references: [], raw: {} });
describe('term evolution', () => {
  it('merges normalized keywords and counts at most once per record', () => {
    const result = termEvolutionAnalysis([record('a', 2022, ['TEMAC', 'temac']), record('b', 2023, ['Temac', 'Networks']), record('c', 2023, ['Networks'])]);
    expect(result[0]).toEqual({ label: 'TEMAC', values: [{ year: 2022, value: 1 }, { year: 2023, value: 1 }] });
    expect(result[1].values).toEqual([{ year: 2023, value: 2 }]);
  });
});
