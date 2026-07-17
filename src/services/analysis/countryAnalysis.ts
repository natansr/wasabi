import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import { rank } from './analysisHelpers';
export const analyzeCountries = (records: BibliographicRecord[], limit = 10) => rank(records.flatMap((record) => record.countries ?? []), limit);
