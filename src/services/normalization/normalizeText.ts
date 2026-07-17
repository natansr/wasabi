export function compactText(value: string) { return value.trim().replace(/\s+/g, ' '); }
export function normalizeText(value: string) { return compactText(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim(); }
