import type { BibliometricNetwork } from '../../domain/networkTypes';

const xml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
export function networkToGraphML(network: BibliometricNetwork) {
  const edgeDefault = network.type === 'citation' ? 'directed' : 'undirected';
  const nodes = network.nodes
    .map(
      (node) =>
        `    <node id="${xml(node.id)}"><data key="label">${xml(node.label)}</data><data key="weight">${node.weight}</data><data key="cluster">${xml(node.clusterId ?? '')}</data></node>`,
    )
    .join('\n');
  const edges = network.edges
    .map(
      (edge) =>
        `    <edge id="${xml(edge.id)}" source="${xml(edge.source)}" target="${xml(edge.target)}"><data key="weight">${edge.weight}</data><data key="normalizedWeight">${edge.normalizedWeight ?? ''}</data></edge>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<graphml xmlns="http://graphml.graphdrawing.org/xmlns"><key id="label" for="node" attr.name="label" attr.type="string"/><key id="weight" for="all" attr.name="weight" attr.type="double"/><key id="cluster" for="node" attr.name="cluster" attr.type="string"/><key id="normalizedWeight" for="edge" attr.name="normalizedWeight" attr.type="double"/><graph id="${xml(network.id)}" edgedefault="${edgeDefault}">\n${nodes}\n${edges}\n</graph></graphml>`;
}
export function networkToGexf(network: BibliometricNetwork) {
  const edgeDefault = network.type === 'citation' ? 'directed' : 'undirected';
  const nodes = network.nodes
    .map(
      (node) =>
        `      <node id="${xml(node.id)}" label="${xml(node.label)}"><attvalues><attvalue for="0" value="${node.weight}"/><attvalue for="1" value="${xml(node.clusterId ?? '')}"/></attvalues></node>`,
    )
    .join('\n');
  const edges = network.edges
    .map(
      (edge, index) =>
        `      <edge id="${index}" source="${xml(edge.source)}" target="${xml(edge.target)}" weight="${edge.weight}"/>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<gexf xmlns="http://gexf.net/1.3" version="1.3"><graph mode="static" defaultedgetype="${edgeDefault}"><attributes class="node"><attribute id="0" title="weight" type="double"/><attribute id="1" title="cluster" type="string"/></attributes><nodes>\n${nodes}\n</nodes><edges>\n${edges}\n</edges></graph></gexf>`;
}
