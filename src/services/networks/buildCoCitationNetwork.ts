import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import type { NetworkEdge, NetworkNode } from '../../domain/networkTypes';
import { normalizeReference } from '../normalization/normalizeReference';
import { combinations, createNetwork, pairKey } from './networkHelpers';
import { DOI_PATTERN } from '../../utils/bibliographicLink';

export function buildCoCitationNetwork(records: BibliographicRecord[]) {
  const nodes = new Map<string, NetworkNode>(); const edges = new Map<string, NetworkEdge>();
  for (const record of records) {
    const references = [...new Map(record.references.map((label) => [normalizeReference(label), label])).entries()].filter(([id]) => id);
    for (const [id, label] of references) { const node = nodes.get(id); if (node) node.weight++; else nodes.set(id, { id, label, weight: 1, attributes: { citations: 1, doi: label.match(DOI_PATTERN)?.[0] ?? '' } }); }
    for (const [[source], [target]] of combinations(references)) { const id = pairKey(source, target); const edge = edges.get(id); if (edge) edge.weight++; else edges.set(id, { id, source, target, weight: 1 }); }
  }
  return createNetwork('cocitation', [...nodes.values()], [...edges.values()]);
}
