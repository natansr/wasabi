import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import { rank } from './analysisHelpers';
export const analyzeSources = (records: BibliographicRecord[], limit = 10) => rank(records.flatMap((record) => record.sourceTitle ? [record.sourceTitle] : []), limit);
