import { compactText, normalizeText } from './normalizeText';
export function splitAuthors(value?: string) {
  if (!value) return [];
  const separator = /[;|]/.test(value) ? /\s*[;|]\s*/ : /\s+and\s+/i;
  const parts = value.split(separator).map(compactText).filter(Boolean);
  return parts.length === 1 && value.includes(',') && (value.match(/,/g)?.length ?? 0) > 1 ? value.split(',').map(compactText).filter(Boolean) : parts;
}
export const normalizeAuthor = normalizeText;
