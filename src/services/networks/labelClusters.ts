import type { ClusterSummary, NetworkNode } from '../../domain/networkTypes';
import { normalizeText } from '../normalization/normalizeText';

const stopwords = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'da',
  'das',
  'de',
  'do',
  'dos',
  'e',
  'em',
  'for',
  'from',
  'in',
  'of',
  'on',
  'or',
  'para',
  'por',
  'the',
  'to',
  'um',
  'uma',
  'with',
]);
const score = (node: NetworkNode) =>
  node.weight +
  Number(node.attributes?.weightedDegree ?? node.attributes?.degree ?? 0);
function frequentTerms(nodes: NetworkNode[]) {
  const terms = new Map<string, { label: string; value: number }>();
  for (const node of nodes)
    for (const word of normalizeText(node.label).split(' ')) {
      if (word.length < 4 || stopwords.has(word)) continue;
      const current = terms.get(word);
      if (current) current.value += score(node);
      else terms.set(word, { label: word, value: score(node) });
    }
  return [...terms.values()]
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
    .slice(0, 3)
    .map((item) => item.label);
}

export function labelClusters(
  clusters: ClusterSummary[],
  nodes: NetworkNode[],
) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return clusters.map((cluster) => {
    const ranked = cluster.nodeIds
      .map((id) => byId.get(id))
      .filter((node): node is NetworkNode => Boolean(node))
      .sort((a, b) => score(b) - score(a));
    const main = ranked.slice(0, 5);
    const descriptiveLabels = main.filter(
      (node) => node.label.length > 45 || node.label.split(/\s+/).length > 5,
    );
    const keywords = descriptiveLabels.length ? frequentTerms(ranked) : [];
    return {
      ...cluster,
      mainNodes: main.map((node) => node.label),
      keywords,
      label: keywords.length
        ? keywords.join(' · ')
        : main
            .slice(0, 3)
            .map((node) => node.label)
            .join(' · '),
    };
  });
}
