import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import type { NetworkEdge, NetworkNode } from '../../domain/networkTypes';
import { normalizeAuthor } from '../normalization/normalizeAuthor';
import { combinations, createNetwork, pairKey } from './networkHelpers';

export function buildCoAuthorshipNetwork(records: BibliographicRecord[]) {
  const nodes = new Map<string, NetworkNode>(); const edges = new Map<string, NetworkEdge>();
  for (const record of records) {
    const authors = [...new Map(record.authors.map((label) => [normalizeAuthor(label), label])).entries()].filter(([id]) => id);
    for (const [id, label] of authors) { const node = nodes.get(id); if (node) { node.weight++; node.attributes = { ...node.attributes, documents: node.weight, citations: Number(node.attributes?.citations ?? 0) + (record.citationCount ?? 0) }; } else nodes.set(id, { id, label, weight: 1, attributes: { documents: 1, citations: record.citationCount ?? 0 } }); }
    for (const [[source], [target]] of combinations(authors)) { const id = pairKey(source, target); const edge = edges.get(id); if (edge) edge.weight++; else edges.set(id, { id, source, target, weight: 1 }); }
  }
  return createNetwork('coauthorship', [...nodes.values()], [...edges.values()]);
}
