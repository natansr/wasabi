import { compactText } from './normalizeText';
export function splitKeywords(value?: string) { return value ? value.split(/\s*[;|]\s*|\s*,\s*/).map(compactText).filter(Boolean) : []; }
