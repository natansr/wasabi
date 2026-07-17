import type { BibliographicRecord } from '../../domain/bibliographicRecord';

export interface SankeyData { nodes: Array<{ name: string }>; links: Array<{ source: string; target: string; value: number }>; }
export function sankeyAnalysis(records: BibliographicRecord[], limitSources = 8): SankeyData {
  const sourceCounts = new Map<string, number>(); for (const record of records) if (record.sourceTitle) sourceCounts.set(record.sourceTitle, (sourceCounts.get(record.sourceTitle) ?? 0) + 1);
  const allowedSources = new Set([...sourceCounts].sort((a, b) => b[1] - a[1]).slice(0, limitSources).map(([source]) => source)); const links = new Map<string, { source: string; target: string; value: number }>();
  const add = (source: string, target: string) => { const key = `${source}\u0000${target}`; const link = links.get(key); if (link) link.value++; else links.set(key, { source, target, value: 1 }); };
  for (const record of records) { if (!record.year || !record.sourceTitle || !record.documentType || !allowedSources.has(record.sourceTitle)) continue; const year = String(record.year); add(year, record.sourceTitle); add(record.sourceTitle, record.documentType); }
  const values = [...links.values()]; return { nodes: [...new Set(values.flatMap((link) => [link.source, link.target]))].map((name) => ({ name })), links: values };
}
