import type { AnalysisResult } from './analysisResult';
import type { BibliographicRecord, DuplicateGroup } from './bibliographicRecord';
import type { InclusionExclusionCriterion } from './criteria';
import type { SupportedLanguage } from './language';
import type { BibliometricNetwork, ClusterSummary } from './networkTypes';
import type { SearchStrategy } from './searchStrategy';
import type { VisualSettings } from './visualSettings';

export interface TemacProject {
  id: string; title: string; objective?: string; researchQuestion?: string;
  descriptors: string[]; searchStrings: string[]; databases: string[];
  startYear?: number; endYear?: number; yearRangeMode?: 'automatic' | 'manual'; knowledgeAreas?: string[];
  inclusionCriteria: string[]; exclusionCriteria: string[]; methodologicalNotes?: string;
  importedRecords: BibliographicRecord[]; deduplicatedRecords: BibliographicRecord[];
  duplicateGroups?: DuplicateGroup[]; analysisResults?: AnalysisResult;
  networks?: BibliometricNetwork[]; visualSettings?: VisualSettings;
  clusterInterpretations?: Record<string, string>; visualizationNotes?: Record<string, string>; reviewSynthesis?: string;
  preferredLanguage?: SupportedLanguage; createdAt: string; updatedAt: string; appVersion: string;
}

export interface ExportedWasabiProject {
  format: 'wasabi-project'; formatVersion: string; appVersion: string; exportedAt: string;
  project: TemacProject; searchStrategy: SearchStrategy;
  criteria: InclusionExclusionCriterion[]; clusters: ClusterSummary[];
}
