import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import type { NetworkType } from '../../domain/networkTypes';
import { buildBibliographicCouplingNetwork } from './buildBibliographicCouplingNetwork';
import { buildCitationNetwork } from './buildCitationNetwork';
import { buildCoAuthorshipNetwork } from './buildCoAuthorshipNetwork';
import { buildCoCitationNetwork } from './buildCoCitationNetwork';
import { buildKeywordCoOccurrenceNetwork } from './buildKeywordCoOccurrenceNetwork';
import { calculateNetworkMetrics } from './calculateNetworkMetrics';
import { detectCommunities } from './detectCommunities';
import { generateNetworkLayout } from './generateNetworkLayout';

export function analyzeNetwork(
  type: NetworkType,
  records: BibliographicRecord[],
) {
  const raw =
    type === 'coauthorship'
      ? buildCoAuthorshipNetwork(records)
      : type === 'keyword-cooccurrence'
        ? buildKeywordCoOccurrenceNetwork(records)
        : type === 'bibliographic-coupling'
          ? buildBibliographicCouplingNetwork(records)
          : type === 'cocitation'
            ? buildCoCitationNetwork(records)
            : buildCitationNetwork(records);
  return generateNetworkLayout(detectCommunities(calculateNetworkMetrics(raw)));
}
