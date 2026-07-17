import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import { rank } from './analysisHelpers';
export const analyzeKeywords = (records: BibliographicRecord[], limit = 10) => rank(records.flatMap((record) => record.keywords), limit);
