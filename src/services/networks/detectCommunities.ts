import louvain from 'graphology-communities-louvain';
import type { BibliometricNetwork, ClusterSummary } from '../../domain/networkTypes';
import { labelClusters } from './labelClusters';
import { toGraphology } from './networkHelpers';

export function detectCommunities(network: BibliometricNetwork): BibliometricNetwork {
  if (!network.nodes.length || !network.edges.length) return { ...network, clusters: [], metrics: { ...(network.metrics ?? { nodeCount: network.nodes.length, edgeCount: network.edges.length, density: 0, componentCount: network.nodes.length }), modularity: 0 } };
  const graph = toGraphology(network, true); const result = louvain.detailed(graph, { getEdgeWeight: 'weight' }); const groups = new Map<number, string[]>();
  for (const [nodeId, community] of Object.entries(result.communities)) groups.set(community, [...(groups.get(community) ?? []), nodeId]);
  const clusters: ClusterSummary[] = [...groups].map(([community, nodeIds]) => ({ id: String(community + 1), nodeIds, mainNodes: [] })); const labeled = labelClusters(clusters, network.nodes);
  return { ...network, nodes: network.nodes.map((node) => ({ ...node, clusterId: String((result.communities[node.id] ?? 0) + 1) })), clusters: labeled, metrics: { ...(network.metrics ?? { nodeCount: graph.order, edgeCount: graph.size, density: 0, componentCount: 0 }), modularity: result.modularity } };
}
