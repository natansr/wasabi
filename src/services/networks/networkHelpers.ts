import { DirectedGraph, UndirectedGraph } from 'graphology';
import type {
  BibliometricNetwork,
  NetworkEdge,
  NetworkNode,
  NetworkType,
} from '../../domain/networkTypes';

export function pairKey(a: string, b: string) {
  return a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`;
}
export function combinations<T>(values: T[]) {
  const pairs: Array<[T, T]> = [];
  for (let i = 0; i < values.length; i++)
    for (let j = i + 1; j < values.length; j++)
      pairs.push([values[i], values[j]]);
  return pairs;
}
export function createNetwork(
  type: NetworkType,
  nodes: NetworkNode[],
  edges: NetworkEdge[],
): BibliometricNetwork {
  return {
    id: `${type}-${Date.now()}`,
    type,
    nodes,
    edges,
    createdAt: new Date().toISOString(),
  };
}
export function toGraphology(
  network: BibliometricNetwork,
  forceUndirected = false,
) {
  const directed = network.type === 'citation' && !forceUndirected;
  const graph = directed ? new DirectedGraph() : new UndirectedGraph();
  for (const node of network.nodes)
    graph.addNode(node.id, {
      ...node.attributes,
      label: node.label,
      weight: node.weight,
      clusterId: node.clusterId,
    });
  for (const edge of network.edges)
    if (
      graph.hasNode(edge.source) &&
      graph.hasNode(edge.target) &&
      edge.source !== edge.target &&
      !graph.hasEdge(edge.source, edge.target)
    ) {
      const attributes = {
        weight: edge.weight,
        normalizedWeight: edge.normalizedWeight,
      };
      if (directed)
        graph.addDirectedEdgeWithKey(
          edge.id,
          edge.source,
          edge.target,
          attributes,
        );
      else
        graph.addUndirectedEdgeWithKey(
          edge.id,
          edge.source,
          edge.target,
          attributes,
        );
    }
  return graph;
}
