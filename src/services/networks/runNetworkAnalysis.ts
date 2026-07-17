import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import type {
  BibliometricNetwork,
  NetworkType,
} from '../../domain/networkTypes';

export function runNetworkAnalysis(
  type: NetworkType,
  records: BibliographicRecord[],
): Promise<BibliometricNetwork> {
  if (typeof Worker === 'undefined')
    return import('./analyzeNetwork').then(({ analyzeNetwork }) =>
      analyzeNetwork(type, records),
    );
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('../../workers/networkAnalysis.worker.ts', import.meta.url),
      { type: 'module' },
    );
    worker.onmessage = (
      event: MessageEvent<{ network?: BibliometricNetwork; error?: string }>,
    ) => {
      worker.terminate();
      if (event.data.network) resolve(event.data.network);
      else reject(new Error(event.data.error ?? 'NETWORK_ANALYSIS_FAILED'));
    };
    worker.onerror = (event) => {
      worker.terminate();
      reject(new Error(event.message));
    };
    worker.postMessage({ type, records });
  });
}
