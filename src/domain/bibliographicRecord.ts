export interface BibliographicRecord {
  id: string;
  title: string;
  abstract?: string;
  authors: string[];
  year?: number;
  sourceTitle?: string;
  documentType?: string;
  doi?: string;
  keywords: string[];
  authorKeywords?: string[];
  indexKeywords?: string[];
  affiliations?: string[];
  countries?: string[];
  institutions?: string[];
  citationCount?: number;
  references: string[];
  databaseSource?: string;
  language?: string;
  url?: string;
  raw: Record<string, unknown>;
}

export type DuplicateConfidence = 'high' | 'medium' | 'low';
export interface DuplicateGroup { id: string; recordIds: string[]; retainedRecordId: string; confidence: DuplicateConfidence; matchedBy: 'doi' | 'title-year-author'; }
