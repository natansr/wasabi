import forceAtlas2 from 'graphology-layout-forceatlas2';
import type { BibliometricNetwork } from '../../domain/networkTypes';
import { toGraphology } from './networkHelpers';

export function generateNetworkLayout(network: BibliometricNetwork, iterations = 100): BibliometricNetwork {
  if (!network.nodes.length) return network; const graph = toGraphology(network);
  graph.forEachNode((node, attributes) => graph.mergeNodeAttributes(node, { x: typeof attributes.x === 'number' ? attributes.x : Math.random(), y: typeof attributes.y === 'number' ? attributes.y : Math.random(), size: Math.max(2, Math.sqrt(Number(attributes.weight ?? 1))) }));
  const safeIterations = graph.order > 1000 ? Math.min(iterations, 15) : graph.order > 500 ? Math.min(iterations, 30) : iterations;
  if (graph.size) forceAtlas2.assign(graph, { iterations: safeIterations, settings: { ...forceAtlas2.inferSettings(graph), barnesHutOptimize: graph.order > 100 } });
  return { ...network, nodes: network.nodes.map((node) => ({ ...node, attributes: { ...node.attributes, x: graph.getNodeAttribute(node.id, 'x'), y: graph.getNodeAttribute(node.id, 'y') } })) };
}
