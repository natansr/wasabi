export interface RankedMetric { label: string; value: number; }
export interface YearMetric { year: number; value: number; }
export interface AnalysisResult {
  totalImported: number; totalDeduplicated: number; duplicatesRemoved: number;
  totalAuthors: number; totalSources: number; totalKeywords: number; totalReferences: number; totalCitations: number;
  startYear?: number; endYear?: number;
  publicationsByYear: YearMetric[]; citationsByYear: YearMetric[]; documentTypes: RankedMetric[];
  topAuthors: RankedMetric[]; topAuthorsByCitations: RankedMetric[]; topSources: RankedMetric[]; topKeywords: RankedMetric[];
  topCountries: RankedMetric[]; topInstitutions: RankedMetric[]; topReferences: RankedMetric[]; generatedAt: string;
}
