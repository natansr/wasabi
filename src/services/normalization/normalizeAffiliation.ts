import { compactText } from './normalizeText';

const unique = (values: string[]) => [...new Map(values.filter(Boolean).map((value) => [value.toLocaleLowerCase(), value])).values()];
export function splitAffiliations(value?: string) { return value ? unique(value.split(/\s*[;|]\s*/).map(compactText)) : []; }
export function institutionsFromAffiliations(affiliations: string[]) { return unique(affiliations.map((affiliation) => compactText(affiliation.split(',')[0] ?? '')).filter(Boolean)); }
export function countriesFromAffiliations(affiliations: string[]) { return unique(affiliations.map((affiliation) => { const parts = affiliation.split(',').map(compactText).filter(Boolean); return parts.at(-1) ?? ''; }).filter((country) => country && !/\d/.test(country))); }
