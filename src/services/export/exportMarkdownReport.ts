import type { TFunction } from 'i18next';
import type { TemacProject } from '../../domain/temacProject';
import type { SupportedLanguage } from '../../domain/language';
import { descriptiveAnalysis } from '../analysis/descriptiveAnalysis';

const value = (text: string | number | undefined, t: TFunction) => text == null || text === '' ? t('report.notInformed') : String(text);
const bullet = (label: string, content: string | number | undefined, t: TFunction) => `- **${label}:** ${value(content, t)}`;
const list = (values: string[], t: TFunction) => values.length ? values.map((item) => `  - ${item}`).join('\n') : `  - ${t('report.notInformed')}`;
const ranked = (items: Array<{ label: string; value: number }>, t: TFunction) => items.length ? items.map((item) => `- ${item.label}: ${item.value}`).join('\n') : `- ${t('report.notAvailable')}`;

export function exportMarkdownReport(project: TemacProject, t: TFunction, synthesis = '', language: SupportedLanguage = 'en-US') {
  const analysis = descriptiveAnalysis(project.importedRecords, project.deduplicatedRecords); const networks = project.networks ?? [];
  const visualizationNotes = Object.entries(project.visualizationNotes ?? {}).filter(([, note]) => note.trim());
  const clusterLines = networks.flatMap((network) => (network.clusters ?? []).map((cluster) => {
    const interpretation = project.clusterInterpretations?.[`${network.type}:cluster:${cluster.id}`]?.trim();
    return `- **${t('networks.clusterNumber', { number: cluster.id })}:** ${cluster.label} (${cluster.nodeIds.length} ${t('report.fields.nodes')})${interpretation ? ` — ${interpretation}` : ''}`;
  }));
  const sections = [
    `# ${project.title}`,
    `## 1. ${t('report.sections.identification')}\n${bullet(t('report.fields.title'), project.title, t)}\n${bullet(t('report.fields.objective'), project.objective, t)}\n${bullet(t('report.fields.question'), project.researchQuestion, t)}\n${bullet(t('report.fields.period'), analysis.startYear && analysis.endYear ? `${analysis.startYear}–${analysis.endYear}` : undefined, t)}\n${bullet(t('report.fields.databases'), project.databases.join('; '), t)}\n${bullet(t('report.fields.areas'), project.knowledgeAreas?.join('; '), t)}`,
    `## 2. ${t('report.sections.strategy')}\n${t('report.fields.descriptors')}:\n${list(project.descriptors, t)}\n\n${t('report.fields.searchStrings')}:\n${list(project.searchStrings, t)}\n\n${t('report.fields.inclusion')}:\n${list(project.inclusionCriteria, t)}\n\n${t('report.fields.exclusion')}:\n${list(project.exclusionCriteria, t)}\n\n${bullet(t('report.fields.notes'), project.methodologicalNotes, t)}`,
    `## 3. ${t('report.sections.corpus')}\n${bullet(t('report.fields.imported'), analysis.totalImported, t)}\n${bullet(t('report.fields.duplicates'), analysis.duplicatesRemoved, t)}\n${bullet(t('report.fields.finalRecords'), analysis.totalDeduplicated, t)}\n${bullet(t('report.fields.documentTypes'), analysis.documentTypes.map((item) => `${item.label} (${item.value})`).join('; '), t)}`,
    `## 4. ${t('report.sections.indicators')}\n### ${t('dashboard.topAuthors')}\n${ranked(analysis.topAuthors, t)}\n\n### ${t('dashboard.topSources')}\n${ranked(analysis.topSources, t)}\n\n### ${t('dashboard.topKeywords')}\n${ranked(analysis.topKeywords, t)}`,
    `## 5. ${t('report.sections.maps')}\n${networks.length ? networks.map((network) => `- ${t(`networks.types.${network.type}`)}: ${network.nodes.length} ${t('report.fields.nodes')}, ${network.edges.length} ${t('report.fields.edges')}`).join('\n') : `- ${t('report.notAvailable')}`}\n\n### ${t('report.sections.visualizationNotes')}\n${visualizationNotes.length ? visualizationNotes.map(([context, note]) => `- **${context}:** ${note}`).join('\n') : `- ${t('report.notAvailable')}`}`,
    `## 6. ${t('report.sections.clusters')}\n${clusterLines.length ? clusterLines.join('\n') : `- ${t('report.notAvailable')}`}`,
    `## 7. ${t('report.sections.synthesis')}\n${synthesis.trim() || t('report.synthesisPlaceholder')}`,
    `## 8. ${t('report.sections.method')}\n${t('report.generatedWith', { date: new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(new Date()) })}`,
  ];
  return sections.join('\n\n');
}
