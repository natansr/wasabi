import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import type { NetworkEdge, NetworkNode } from '../../domain/networkTypes';
import { normalizeReference } from '../normalization/normalizeReference';
import { createNetwork, pairKey } from './networkHelpers';

export function buildBibliographicCouplingNetwork(records: BibliographicRecord[]) {
  const documents = records.map((record) => ({ record, references: new Set(record.references.map(normalizeReference).filter(Boolean)) }));
  const nodes: NetworkNode[] = documents.map(({ record, references }) => ({ id: record.id, label: record.title, weight: references.size, attributes: { year: record.year ?? null, citations: record.citationCount ?? 0, references: references.size, doi: record.doi ?? '', url: record.url ?? '' } })); const edges: NetworkEdge[] = [];
  for (let i = 0; i < documents.length; i++) for (let j = i + 1; j < documents.length; j++) { const left = documents[i]; const right = documents[j]; const shared = [...left.references].filter((reference) => right.references.has(reference)).length; if (!shared) continue; edges.push({ id: pairKey(left.record.id, right.record.id), source: left.record.id, target: right.record.id, weight: shared, normalizedWeight: shared / Math.sqrt(left.references.size * right.references.size) }); }
  return createNetwork('bibliographic-coupling', nodes, edges);
}
