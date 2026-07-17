import { describe, expect, it } from 'vitest';
import type { BibliometricNetwork } from '../domain/networkTypes';
import { networkEdgesToCsv, networkNodesToCsv, networkToJson } from '../services/export/exportNetwork';
import { generateDensityMap } from '../services/networks/generateDensityMap';
import { networkToGexf, networkToGraphML } from '../services/export/exportGraphFormats';
import { exportRecordsCsv } from '../services/export/exportCsv';

const network: BibliometricNetwork = { id: 'network-1', type: 'coauthorship', createdAt: '2026-01-01T00:00:00Z', nodes: [{ id: 'ana', label: 'Silva, Ana', weight: 4, clusterId: '1', attributes: { x: 2, y: 3, degree: 1 } }, { id: 'bob', label: 'Bob', weight: 1, attributes: { x: 5, y: 7 } }], edges: [{ id: 'edge-1', source: 'ana', target: 'bob', weight: 2, normalizedWeight: 0.5 }] };

describe('network density and exports', () => {
  it('creates weighted density points from layout positions', () => {
    const points = generateDensityMap(network);
    expect(points).toHaveLength(2); expect(points[0]).toMatchObject({ id: 'ana', x: 2, y: 3, intensity: 1 }); expect(points[0].radius).toBeGreaterThan(points[1].radius);
  });
  it('exports valid node and edge CSV', () => {
    expect(networkNodesToCsv(network)).toContain('"Silva, Ana"');
    expect(networkEdgesToCsv(network)).toContain('edge-1,ana,bob,2,0.5');
  });
  it('exports the complete network as JSON', () => expect(JSON.parse(networkToJson(network)).type).toBe('coauthorship'));
  it('exports interoperable GraphML and GEXF XML', () => {
    expect(networkToGraphML(network)).toContain('<graphml xmlns="http://graphml.graphdrawing.org/xmlns">');
    expect(networkToGraphML(network)).toContain('label">Silva, Ana</data>');
    expect(networkToGexf(network)).toContain('<gexf xmlns="http://gexf.net/1.3"');
  });
  it('marks citation exports as directed', () => {
    const citation = { ...network, type: 'citation' as const, edges: network.edges.map((edge) => ({ ...edge, directed: true })) };
    expect(networkToGraphML(citation)).toContain('edgedefault="directed"'); expect(networkToGexf(citation)).toContain('defaultedgetype="directed"');
  });
  it('exports a UTF-8 CSV corpus with list fields', () => {
    const csv = exportRecordsCsv([{ id: '1', title: 'Análise', authors: ['Ana', 'Bob'], keywords: ['TEMAC'], references: [], raw: {} }]);
    expect(csv.startsWith('\ufeff')).toBe(true); expect(csv).toContain('Análise,Ana; Bob');
  });
});
