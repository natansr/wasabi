import { describe, expect, it } from 'vitest';
import { doiLink, recordLink, safeExternalLink } from '../utils/bibliographicLink';

describe('bibliographic links', () => {
  it('builds a canonical DOI address from plain or URL values', () => {
    expect(doiLink('10.1000/Test.1')).toBe('https://doi.org/10.1000/test.1');
    expect(doiLink('https://doi.org/10.1000/Test.1')).toBe('https://doi.org/10.1000/test.1');
  });

  it('prioritizes DOI and falls back to a safe record URL', () => {
    expect(recordLink({ doi: '10.1000/a', url: 'https://example.org/item' })).toBe('https://doi.org/10.1000/a');
    expect(recordLink({ url: 'https://example.org/item' })).toBe('https://example.org/item');
  });

  it('rejects non-http protocols', () => {
    expect(safeExternalLink('javascript:alert(1)')).toBeUndefined();
  });
});
