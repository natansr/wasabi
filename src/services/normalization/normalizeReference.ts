import { compactText, normalizeText } from './normalizeText';
export function splitReferences(value?: string) { return value ? value.split(/\s*;\s*|\r?\n/).map(compactText).filter(Boolean) : []; }
export const normalizeReference = normalizeText;
