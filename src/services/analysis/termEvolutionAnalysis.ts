import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import { normalizeText } from '../normalization/normalizeText';

export interface TermEvolutionSeries { label: string; values: Array<{ year: number; value: number }>; }
export function termEvolutionAnalysis(records: BibliographicRecord[], limit = 6): TermEvolutionSeries[] {
  const labels = new Map<string, string>(); const totals = new Map<string, number>(); const years = new Map<string, Map<number, number>>();
  for (const record of records) if (record.year) { const unique = new Map<string, string>(); for (const item of record.keywords) { const id = normalizeText(item); if (id && !unique.has(id)) unique.set(id, item); } for (const [id, label] of unique) { labels.set(id, labels.get(id) ?? label); totals.set(id, (totals.get(id) ?? 0) + 1); const counts = years.get(id) ?? new Map<number, number>(); counts.set(record.year, (counts.get(record.year) ?? 0) + 1); years.set(id, counts); } }
  return [...totals].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([id]) => ({ label: labels.get(id)!, values: [...(years.get(id) ?? [])].map(([year, value]) => ({ year, value })).sort((a, b) => a.year - b.year) }));
}
