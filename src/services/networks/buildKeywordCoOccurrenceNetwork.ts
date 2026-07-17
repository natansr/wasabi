import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import type { NetworkEdge, NetworkNode } from '../../domain/networkTypes';
import { normalizeText } from '../normalization/normalizeText';
import { combinations, createNetwork, pairKey } from './networkHelpers';

export function buildKeywordCoOccurrenceNetwork(records: BibliographicRecord[]) {
  const nodes = new Map<string, NetworkNode>(); const edges = new Map<string, NetworkEdge>();
  for (const record of records) {
    const keywords = [...new Map(record.keywords.map((label) => [normalizeText(label), label])).entries()].filter(([id]) => id);
    for (const [id, label] of keywords) { const node = nodes.get(id); if (node) { node.weight++; node.attributes = { ...node.attributes, frequency: node.weight }; } else nodes.set(id, { id, label, weight: 1, attributes: { frequency: 1 } }); }
    for (const [[source], [target]] of combinations(keywords)) { const id = pairKey(source, target); const edge = edges.get(id); if (edge) edge.weight++; else edges.set(id, { id, source, target, weight: 1 }); }
  }
  return createNetwork('keyword-cooccurrence', [...nodes.values()], [...edges.values()]);
}
