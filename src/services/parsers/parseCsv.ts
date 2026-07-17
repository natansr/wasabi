import Papa from 'papaparse';
import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import { normalizeRecord } from '../normalization/normalizeRecord';
import { detectFieldMapping, type FieldMapping } from './fieldMapping';

export interface ParsedRecords { records: BibliographicRecord[]; headers: string[]; mapping: FieldMapping; errors: string[]; }
export function parseCsv(content: string, mappingOverride?: FieldMapping): ParsedRecords {
  const parsed = Papa.parse<Record<string, unknown>>(content, { header: true, skipEmptyLines: 'greedy', transformHeader: (header) => header.trim() });
  const headers = parsed.meta.fields ?? []; const mapping = mappingOverride ?? detectFieldMapping(headers);
  const isScopus = headers.includes('EID') && headers.includes('Source');
  return { records: parsed.data.map((row) => normalizeRecord(row, mapping, isScopus ? 'Scopus' : 'CSV')), headers, mapping, errors: parsed.errors.map((error) => error.message) };
}
