import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import type { NetworkEdge, NetworkNode } from '../../domain/networkTypes';
import { normalizeDoi } from '../normalization/normalizeDoi';
import { normalizeReference } from '../normalization/normalizeReference';
import { normalizeText } from '../normalization/normalizeText';
import { createNetwork } from './networkHelpers';

const DOI_PATTERN = /10\.\d{4,9}\/[-._;()/:a-z0-9]+/i;
export function buildCitationNetwork(records: BibliographicRecord[]) {
  const nodes: NetworkNode[] = records.map((record) => ({ id: record.id, label: record.title, weight: record.citationCount ?? 0, attributes: { year: record.year ?? null, doi: record.doi ?? '', url: record.url ?? '', citations: record.citationCount ?? 0 } }));
  const byDoi = new Map(records.flatMap((record) => { const doi = normalizeDoi(record.doi); return doi ? [[doi, record.id] as const] : []; }));
  const titles = records.map((record) => ({ id: record.id, title: normalizeText(record.title) })).filter((item) => item.title.length >= 16); const edges = new Map<string, NetworkEdge>();
  for (const citing of records) for (const reference of citing.references) { const normalizedReference = normalizeReference(reference); const doi = normalizeDoi(reference.match(DOI_PATTERN)?.[0]); let citedId = doi ? byDoi.get(doi) : undefined; if (!citedId) citedId = titles.find((item) => item.id !== citing.id && normalizedReference.includes(item.title))?.id; if (!citedId || citedId === citing.id) continue; const id = `${citing.id}->${citedId}`; const existing = edges.get(id); if (existing) existing.weight++; else edges.set(id, { id, source: citing.id, target: citedId, weight: 1, directed: true }); }
  const inbound = new Map<string, number>(); for (const edge of edges.values()) inbound.set(edge.target, (inbound.get(edge.target) ?? 0) + edge.weight);
  return createNetwork('citation', nodes.map((node) => ({ ...node, weight: inbound.get(node.id) ?? 0, attributes: { ...node.attributes, internalCitations: inbound.get(node.id) ?? 0 } })), [...edges.values()]);
}
