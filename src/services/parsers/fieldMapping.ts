export type BibliographicField = 'title' | 'authors' | 'year' | 'sourceTitle' | 'documentType' | 'doi' | 'keywords' | 'authorKeywords' | 'indexKeywords' | 'abstract' | 'citationCount' | 'references' | 'affiliations' | 'countries' | 'institutions' | 'url' | 'language' | 'databaseSource';
export type FieldMapping = Partial<Record<BibliographicField, string>>;

const aliases: Record<BibliographicField, string[]> = {
  title: ['title', 'document title', 'article title', 'ti'], authors: ['authors', 'author', 'author(s)', 'au', 'author full names'], year: ['year', 'publication year', 'py'],
  sourceTitle: ['source title', 'journal', 'publication name', 'journaltitle', 'so', 'source'], documentType: ['document type', 'type', 'dt'], doi: ['doi', 'di'],
  keywords: ['keywords', 'keyword'], authorKeywords: ['author keywords', 'de'], indexKeywords: ['index keywords', 'id'], abstract: ['abstract', 'ab'],
  citationCount: ['citations', 'cited by', 'times cited', 'tc'], references: ['references', 'cited references', 'cr'], affiliations: ['affiliations', 'affiliation', 'c1'],
  countries: ['countries', 'country'], institutions: ['institutions', 'institution'], url: ['url', 'link'], language: ['language of original document', 'language', 'la'], databaseSource: ['database source', 'source database'],
};

const canonical = (value: string) => value.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');

export function detectFieldMapping(headers: string[]): FieldMapping {
  const normalizedHeaders = new Map(headers.map((header) => [canonical(header), header]));
  return Object.fromEntries(Object.entries(aliases).flatMap(([field, names]) => {
    const header = names.map((name) => normalizedHeaders.get(canonical(name))).find(Boolean);
    return header ? [[field, header]] : [];
  })) as FieldMapping;
}

export const bibliographicFields = Object.keys(aliases) as BibliographicField[];
