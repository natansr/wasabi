import type { BibliometricNetwork } from '../../domain/networkTypes';

import { escapeCsv } from './exportCsv';
export function networkNodesToCsv(network: BibliometricNetwork) { const rows = [['id', 'label', 'weight', 'cluster', 'degree', 'weightedDegree'], ...network.nodes.map((node) => [node.id, node.label, node.weight, node.clusterId ?? '', node.attributes?.degree ?? '', node.attributes?.weightedDegree ?? ''])]; return rows.map((row) => row.map(escapeCsv).join(',')).join('\n'); }
export function networkEdgesToCsv(network: BibliometricNetwork) { const rows = [['id', 'source', 'target', 'weight', 'normalizedWeight'], ...network.edges.map((edge) => [edge.id, edge.source, edge.target, edge.weight, edge.normalizedWeight ?? ''])]; return rows.map((row) => row.map(escapeCsv).join(',')).join('\n'); }
export function networkToJson(network: BibliometricNetwork) { return JSON.stringify(network, null, 2); }
