import type { BibliographicRecord } from '../domain/bibliographicRecord';
import { normalizeDoi } from '../services/normalization/normalizeDoi';

export const DOI_PATTERN = /10\.\d{4,9}\/[-._;()/:a-z0-9]+/i;

export function doiLink(value?: string) {
  const doi = normalizeDoi(value?.match(DOI_PATTERN)?.[0] ?? value);
  return doi ? `https://doi.org/${doi}` : undefined;
}

export function safeExternalLink(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export function recordLink(record: Pick<BibliographicRecord, 'doi' | 'url'>) {
  return doiLink(record.doi) ?? safeExternalLink(record.url);
}
