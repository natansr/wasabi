import { describe, expect, it } from 'vitest';
import type { BibliographicRecord } from '../domain/bibliographicRecord';
import { buildCoAuthorshipNetwork } from '../services/networks/buildCoAuthorshipNetwork';
import { buildKeywordCoOccurrenceNetwork } from '../services/networks/buildKeywordCoOccurrenceNetwork';
import { buildBibliographicCouplingNetwork } from '../services/networks/buildBibliographicCouplingNetwork';
import { buildCoCitationNetwork } from '../services/networks/buildCoCitationNetwork';
import { calculateNetworkMetrics } from '../services/networks/calculateNetworkMetrics';
import { detectCommunities } from '../services/networks/detectCommunities';
import { buildCitationNetwork } from '../services/networks/buildCitationNetwork';
import { labelClusters } from '../services/networks/labelClusters';

const record = (id: string, authors: string[], keywords: string[], references: string[]): BibliographicRecord => ({ id, title: `Document ${id}`, authors, keywords, references, year: 2024, citationCount: 2, raw: {} });
const corpus = [record('a', ['Ana', 'Bob'], ['TEMAC', 'Networks'], ['Ref 1', 'Ref 2']), record('b', ['Ana', 'Carla'], ['TEMAC', 'Evidence'], ['Ref 1', 'Ref 3']), record('c', ['Bob'], ['Mapping'], ['Ref 4'])];

describe('bibliometric network builders', () => {
  it('builds co-authorship weights from joint publications', () => {
    const network = buildCoAuthorshipNetwork(corpus);
    expect(network.nodes.find((node) => node.label === 'Ana')?.weight).toBe(2);
    expect(network.edges).toHaveLength(2);
  });
  it('builds keyword co-occurrence and merges normalized labels', () => {
    const network = buildKeywordCoOccurrenceNetwork([...corpus, record('d', [], ['temac', 'Networks'], [])]);
    expect(network.nodes.find((node) => node.id === 'temac')?.weight).toBe(3);
    expect(network.edges.find((edge) => edge.source === 'temac' && edge.target === 'networks')?.weight).toBe(2);
  });
  it('calculates raw and normalized bibliographic coupling', () => {
    const network = buildBibliographicCouplingNetwork(corpus); const edge = network.edges.find((item) => item.source === 'a' && item.target === 'b');
    expect(edge?.weight).toBe(1); expect(edge?.normalizedWeight).toBeCloseTo(0.5);
  });
  it('counts co-cited references', () => {
    const network = buildCoCitationNetwork(corpus);
    expect(network.nodes.find((node) => node.id === 'ref 1')?.weight).toBe(2);
    expect(network.edges).toHaveLength(2);
  });
  it('adds graph metrics and Louvain clusters', () => {
    const network = detectCommunities(calculateNetworkMetrics(buildCoAuthorshipNetwork(corpus)));
    expect(network.metrics).toMatchObject({ nodeCount: 3, edgeCount: 2, componentCount: 1 });
    expect(network.clusters?.length).toBeGreaterThan(0); expect(network.nodes.every((node) => node.clusterId)).toBe(true);
  });
  it('builds directed citations between corpus documents by DOI and title', () => {
    const cited = { ...record('cited', ['Ana'], [], []), title: 'A distinctive evidence mapping method', doi: '10.5555/method' };
    const byDoi = { ...record('doi-source', ['Bob'], [], ['Silva A., doi:10.5555/method']), title: 'First citing document' };
    const byTitle = { ...record('title-source', ['Carla'], [], ['Silva A., A distinctive evidence mapping method, Journal, 2024']), title: 'Second citing document' };
    const network = buildCitationNetwork([cited, byDoi, byTitle]);
    expect(network.edges).toEqual(expect.arrayContaining([expect.objectContaining({ source: 'doi-source', target: 'cited', directed: true }), expect.objectContaining({ source: 'title-source', target: 'cited', directed: true })]));
    expect(network.nodes.find((node) => node.id === 'cited')?.weight).toBe(2);
  });
  it('labels document clusters with recurring weighted terms', () => {
    const clusters = labelClusters([{ id: '1', nodeIds: ['a', 'b'], mainNodes: [] }], [{ id: 'a', label: 'Bibliometric mapping for educational evidence synthesis', weight: 5 }, { id: 'b', label: 'Bibliometric networks in educational research evidence', weight: 3 }]);
    expect(clusters[0].keywords).toEqual(expect.arrayContaining(['bibliometric', 'educational', 'evidence'])); expect(clusters[0].label).toContain('bibliometric');
  });
});
