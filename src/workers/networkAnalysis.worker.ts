/// <reference lib="webworker" />
import type { BibliographicRecord } from '../domain/bibliographicRecord';
import type { NetworkType } from '../domain/networkTypes';
import { analyzeNetwork } from '../services/networks/analyzeNetwork';

self.onmessage = (
  event: MessageEvent<{ type: NetworkType; records: BibliographicRecord[] }>,
) => {
  try {
    self.postMessage({
      network: analyzeNetwork(event.data.type, event.data.records),
    });
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : 'NETWORK_ANALYSIS_FAILED',
    });
  }
};
