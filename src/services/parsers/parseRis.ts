import { normalizeRecord } from '../normalization/normalizeRecord';
import type { ParsedRecords } from './parseCsv';
import type { FieldMapping } from './fieldMapping';

const mapping: FieldMapping = { title: 'title', authors: 'authors', year: 'year', sourceTitle: 'sourceTitle', documentType: 'documentType', doi: 'doi', keywords: 'keywords', abstract: 'abstract', references: 'references', affiliations: 'affiliations', url: 'url', language: 'language' };
const tags: Record<string, string> = { TI: 'title', T1: 'title', AU: 'authors', A1: 'authors', PY: 'year', Y1: 'year', JO: 'sourceTitle', JF: 'sourceTitle', T2: 'sourceTitle', TY: 'documentType', DO: 'doi', KW: 'keywords', AB: 'abstract', N2: 'abstract', CR: 'references', AD: 'affiliations', UR: 'url', LA: 'language' };

export function parseRis(content: string): ParsedRecords {
  const entries: Record<string, string[]>[] = []; let current: Record<string, string[]> | undefined; let lastField: string | undefined;
  for (const line of content.replace(/^\ufeff/, '').split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9]{2})\s*-\s*(.*)$/);
    if (!match) { if (current && lastField && line.trim()) current[lastField][current[lastField].length - 1] += ` ${line.trim()}`; continue; }
    const [, tag, value] = match; if (tag === 'TY') current = {}; if (!current) continue; if (tag === 'ER') { entries.push(current); current = undefined; lastField = undefined; continue; }
    const field = tags[tag]; if (!field) continue; lastField = field; (current[field] ??= []).push(value.trim());
  }
  if (current) entries.push(current);
  const rows = entries.map((entry) => Object.fromEntries(Object.entries(entry).map(([field, values]) => [field, field === 'year' ? values[0]?.match(/\d{4}/)?.[0] ?? values[0] : values.join('; ')])));
  return { records: rows.map((row) => normalizeRecord(row, mapping, 'RIS')), headers: Object.keys(mapping), mapping, errors: rows.length ? [] : ['NO_RIS_ENTRIES'] };
}
