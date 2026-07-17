import { describe, expect, it } from 'vitest';
import { normalizeDoi } from '../services/normalization/normalizeDoi';
import { normalizeText } from '../services/normalization/normalizeText';
import { splitAuthors } from '../services/normalization/normalizeAuthor';
import { splitKeywords } from '../services/normalization/normalizeKeyword';
import { splitReferences } from '../services/normalization/normalizeReference';
import { countriesFromAffiliations, institutionsFromAffiliations, splitAffiliations } from '../services/normalization/normalizeAffiliation';

describe('normalization', () => {
  it('normalizes DOI prefixes and case', () => expect(normalizeDoi('https://doi.org/10.1000/ABC. ')).toBe('10.1000/abc'));
  it('normalizes comparison text without changing source data', () => expect(normalizeText('  Análise: Bibliométrica!  ')).toBe('analise bibliometrica'));
  it('splits authors, keywords, and references', () => {
    expect(splitAuthors('Ana Silva; Bob Jones')).toEqual(['Ana Silva', 'Bob Jones']);
    expect(splitKeywords('TEMAC, bibliometria | ciência')).toEqual(['TEMAC', 'bibliometria', 'ciência']);
    expect(splitReferences('Ref A; Ref B')).toEqual(['Ref A', 'Ref B']);
  });
  it('extracts Scopus institutions and countries without splitting addresses on commas', () => {
    const affiliations = splitAffiliations('Universidade Estadual de Goiás, Anápolis, Brazil; University of Porto, Porto, Portugal');
    expect(affiliations).toHaveLength(2);
    expect(institutionsFromAffiliations(affiliations)).toEqual(['Universidade Estadual de Goiás', 'University of Porto']);
    expect(countriesFromAffiliations(affiliations)).toEqual(['Brazil', 'Portugal']);
  });
});
