import type { AnalysisResult, YearMetric } from '../../domain/analysisResult';
import type { BibliographicRecord } from '../../domain/bibliographicRecord';
import { analyzeAuthors, analyzeAuthorsByCitations } from './authorAnalysis';
import { analyzeCountries } from './countryAnalysis';
import { analyzeInstitutions } from './institutionAnalysis';
import { analyzeKeywords } from './keywordAnalysis';
import { analyzeSources } from './sourceAnalysis';
import { analyzeReferences, citationsByPublicationYear } from './citationAnalysis';
import { rank, uniqueCount } from './analysisHelpers';

export function publicationsByYear(records: BibliographicRecord[]): YearMetric[] { const years = new Map<number, number>(); for (const record of records) if (record.year) years.set(record.year, (years.get(record.year) ?? 0) + 1); return [...years].map(([year, value]) => ({ year, value })).sort((a, b) => a.year - b.year); }

export function descriptiveAnalysis(imported: BibliographicRecord[], records: BibliographicRecord[]): AnalysisResult {
  const years = records.flatMap((record) => record.year ? [record.year] : []); const allAuthors = records.flatMap((record) => record.authors); const allSources = records.flatMap((record) => record.sourceTitle ? [record.sourceTitle] : []); const allKeywords = records.flatMap((record) => record.keywords); const allReferences = records.flatMap((record) => record.references);
  return {
    totalImported: imported.length, totalDeduplicated: records.length, duplicatesRemoved: imported.length - records.length,
    totalAuthors: uniqueCount(allAuthors), totalSources: uniqueCount(allSources), totalKeywords: uniqueCount(allKeywords), totalReferences: uniqueCount(allReferences), totalCitations: records.reduce((sum, record) => sum + (record.citationCount ?? 0), 0),
    startYear: years.length ? Math.min(...years) : undefined, endYear: years.length ? Math.max(...years) : undefined,
    publicationsByYear: publicationsByYear(records), citationsByYear: citationsByPublicationYear(records), documentTypes: rank(records.flatMap((record) => record.documentType ? [record.documentType] : [])),
    topAuthors: analyzeAuthors(records), topAuthorsByCitations: analyzeAuthorsByCitations(records), topSources: analyzeSources(records), topKeywords: analyzeKeywords(records), topCountries: analyzeCountries(records), topInstitutions: analyzeInstitutions(records), topReferences: analyzeReferences(records), generatedAt: new Date().toISOString(),
  };
}
