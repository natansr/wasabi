import { normalizeRecord } from '../normalization/normalizeRecord';
import { detectFieldMapping } from './fieldMapping';
import type { ParsedRecords } from './parseCsv';

function parseFields(body: string) {
  const fields: Record<string, unknown> = {}; let index = body.indexOf(',') + 1;
  while (index > 0 && index < body.length) {
    while (/[,\s]/.test(body[index] ?? '')) index++;
    const nameMatch = body.slice(index).match(/^([\w-]+)\s*=\s*/); if (!nameMatch) break;
    const name = nameMatch[1]; index += nameMatch[0].length; const opener = body[index]; let value = '';
    if (opener === '{' || opener === '"') { const closer = opener === '{' ? '}' : '"'; let depth = 0; index++; while (index < body.length) { const char = body[index++]; if (opener === '{' && char === '{') depth++; else if (char === closer) { if (depth === 0) break; depth--; } value += char; } } else { const end = body.indexOf(',', index); value = body.slice(index, end < 0 ? body.length : end); index = end < 0 ? body.length : end; }
    fields[name] = value.replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
  }
  return fields;
}

export function parseBibtex(content: string): ParsedRecords {
  const rows: Record<string, unknown>[] = []; const entryPattern = /@[a-z]+\s*\{/gi;
  while (entryPattern.exec(content) !== null) { let index = entryPattern.lastIndex; let depth = 1; while (index < content.length && depth) { if (content[index] === '{') depth++; else if (content[index] === '}') depth--; index++; } rows.push(parseFields(content.slice(entryPattern.lastIndex, index - 1))); entryPattern.lastIndex = index; }
  const headers = [...new Set(rows.flatMap(Object.keys))]; const mapping = detectFieldMapping(headers);
  return { records: rows.map((row) => normalizeRecord(row, mapping, 'BibTeX')), headers, mapping, errors: rows.length ? [] : ['NO_BIBTEX_ENTRIES'] };
}
