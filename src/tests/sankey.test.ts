import { describe, expect, it } from 'vitest';
import type { BibliographicRecord } from '../domain/bibliographicRecord';
import { sankeyAnalysis } from '../services/analysis/sankeyAnalysis';

const record = (id: string, year: number, sourceTitle: string, documentType: string): BibliographicRecord => ({ id, title: id, authors: [], keywords: [], references: [], year, sourceTitle, documentType, raw: {} });
describe('Sankey analysis', () => {
  it('links years to sources and sources to document types', () => { const result = sankeyAnalysis([record('a', 2024, 'Journal A', 'Article'), record('b', 2024, 'Journal A', 'Article'), record('c', 2025, 'Journal B', 'Review')]); expect(result.links).toEqual(expect.arrayContaining([{ source: '2024', target: 'Journal A', value: 2 }, { source: 'Journal A', target: 'Article', value: 2 }])); });
  it('returns no links when required categories are absent', () => expect(sankeyAnalysis([{ id: 'a', title: 'A', authors: [], keywords: [], references: [], raw: {} }]).links).toEqual([]));
});
