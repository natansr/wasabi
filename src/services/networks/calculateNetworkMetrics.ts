import betweenness from 'graphology-metrics/centrality/betweenness';
import { weightedDegree } from 'graphology-metrics/node/weighted-degree';
import { density } from 'graphology-metrics/graph';
import type { BibliometricNetwork } from '../../domain/networkTypes';
import { toGraphology } from './networkHelpers';

function componentCount(network: BibliometricNetwork) { const adjacency = new Map(network.nodes.map((node) => [node.id, new Set<string>()])); for (const edge of network.edges) { adjacency.get(edge.source)?.add(edge.target); adjacency.get(edge.target)?.add(edge.source); } const visited = new Set<string>(); let count = 0; for (const node of adjacency.keys()) if (!visited.has(node)) { count++; const queue = [node]; visited.add(node); while (queue.length) for (const neighbor of adjacency.get(queue.pop()!) ?? []) if (!visited.has(neighbor)) { visited.add(neighbor); queue.push(neighbor); } } return count; }

export function calculateNetworkMetrics(network: BibliometricNetwork): BibliometricNetwork {
  const graph = toGraphology(network); const centrality = graph.order <= 500 ? betweenness(graph, { normalized: true }) : {};
  const nodes = network.nodes.map((node) => ({ ...node, attributes: { ...node.attributes, degree: graph.degree(node.id), weightedDegree: weightedDegree(graph, node.id, 'weight'), degreeCentrality: graph.order > 1 ? graph.degree(node.id) / (graph.order - 1) : 0, betweenness: centrality[node.id] } }));
  return { ...network, nodes, metrics: { nodeCount: graph.order, edgeCount: graph.size, density: density(graph), componentCount: componentCount(network) } };
}
