import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import type { FieldMapping } from '../parsers/fieldMapping';
import { createId } from '../../utils/ids';
import { compactText } from './normalizeText';
import { normalizeDoi } from './normalizeDoi';
import { splitAuthors } from './normalizeAuthor';
import { splitKeywords } from './normalizeKeyword';
import { splitReferences } from './normalizeReference';
import { countriesFromAffiliations, institutionsFromAffiliations, splitAffiliations } from './normalizeAffiliation';

const text = (raw: Record<string, unknown>, field?: string) => field && raw[field] != null ? String(raw[field]) : '';
const list = (value: string) => splitKeywords(value);

export function normalizeRecord(raw: Record<string, unknown>, mapping: FieldMapping, databaseSource?: string): BibliographicRecord {
  const authorKeywords = splitKeywords(text(raw, mapping.authorKeywords)); const indexKeywords = splitKeywords(text(raw, mapping.indexKeywords));
  const keywords = [...new Set([...splitKeywords(text(raw, mapping.keywords)), ...authorKeywords, ...indexKeywords])];
  const affiliations = splitAffiliations(text(raw, mapping.affiliations)); const explicitCountries = list(text(raw, mapping.countries)); const explicitInstitutions = list(text(raw, mapping.institutions));
  const yearValue = Number.parseInt(text(raw, mapping.year), 10); const citationValue = Number.parseInt(text(raw, mapping.citationCount), 10);
  return {
    id: createId('record'), title: compactText(text(raw, mapping.title)), abstract: compactText(text(raw, mapping.abstract)) || undefined,
    authors: splitAuthors(text(raw, mapping.authors)), year: Number.isFinite(yearValue) ? yearValue : undefined, sourceTitle: compactText(text(raw, mapping.sourceTitle)) || undefined,
    documentType: compactText(text(raw, mapping.documentType)) || undefined, doi: normalizeDoi(text(raw, mapping.doi)), keywords, authorKeywords, indexKeywords,
    affiliations, countries: explicitCountries.length ? explicitCountries : countriesFromAffiliations(affiliations), institutions: explicitInstitutions.length ? explicitInstitutions : institutionsFromAffiliations(affiliations),
    citationCount: Number.isFinite(citationValue) ? citationValue : undefined, references: splitReferences(text(raw, mapping.references)), databaseSource: compactText(text(raw, mapping.databaseSource)) || databaseSource,
    language: compactText(text(raw, mapping.language)) || undefined, url: compactText(text(raw, mapping.url)) || undefined, raw,
  };
}
