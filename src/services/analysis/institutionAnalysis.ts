import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import { rank } from './analysisHelpers';
export const analyzeInstitutions = (records: BibliographicRecord[], limit = 10) => rank(records.flatMap((record) => record.institutions ?? []), limit);
