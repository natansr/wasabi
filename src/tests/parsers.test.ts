import { describe, expect, it } from 'vitest';
import { parseCsv } from '../services/parsers/parseCsv';
import { parseBibtex } from '../services/parsers/parseBibtex';
import { parseRis } from '../services/parsers/parseRis';

describe('bibliographic parsers', () => {
  it('recognizes common Scopus/WoS CSV fields', () => {
    const parsed = parseCsv('Document Title,Authors,Publication Year,DOI,Author Keywords,Cited References\nMapping science,Ana Silva; Bob Jones,2024,https://doi.org/10.1/ABC,bibliometrics; networks,Ref A; Ref B');
    expect(parsed.records[0]).toMatchObject({ title: 'Mapping science', year: 2024, doi: '10.1/abc', authors: ['Ana Silva', 'Bob Jones'] });
    expect(parsed.records[0].references).toEqual(['Ref A', 'Ref B']);
  });
  it('distinguishes the Scopus publication source from the database source', () => {
    const parsed = parseCsv('\ufeff"Authors","Title","Year","Source title","Language of Original Document","Document Type","Affiliations","Source","EID"\n"Ana Silva","A study","2026","Research Journal","English","Article","UEG, Anápolis, Brazil; University of Porto, Porto, Portugal","Scopus","2-s2.0-1"');
    expect(parsed.records[0]).toMatchObject({ sourceTitle: 'Research Journal', databaseSource: 'Scopus', language: 'English', documentType: 'Article', institutions: ['UEG', 'University of Porto'], countries: ['Brazil', 'Portugal'] });
    expect(parsed.headers[0]).toBe('Authors');
  });
  it('parses nested-brace BibTeX values', () => {
    const parsed = parseBibtex('@article{demo, title={Scientific {Mapping}}, author={Ana Silva and Bob Jones}, year={2023}, journal={Research Journal}, doi={10.2/XYZ}, keywords={science; networks}}');
    expect(parsed.errors).toEqual([]); expect(parsed.records[0]).toMatchObject({ title: 'Scientific Mapping', year: 2023, sourceTitle: 'Research Journal', authors: ['Ana Silva', 'Bob Jones'], doi: '10.2/xyz' });
  });
  it('parses repeated and multiline RIS fields', () => {
    const parsed = parseRis('TY  - JOUR\nTI  - Evidence mapping\nAU  - Silva, Ana\nAU  - Jones, Bob\nPY  - 2025/03/01\nJO  - Research Journal\nKW  - TEMAC\nKW  - Bibliometrics\nAB  - First abstract line\n      continued line\nDO  - 10.5/ABC\nER  -');
    expect(parsed.errors).toEqual([]); expect(parsed.records[0]).toMatchObject({ title: 'Evidence mapping', authors: ['Silva, Ana', 'Jones, Bob'], year: 2025, sourceTitle: 'Research Journal', keywords: ['TEMAC', 'Bibliometrics'], abstract: 'First abstract line continued line', doi: '10.5/abc', databaseSource: 'RIS' });
  });
});
