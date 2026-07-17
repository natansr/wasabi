import type { InclusionExclusionCriterion } from '../../domain/criteria';
import type { ExportedWasabiProject, TemacProject } from '../../domain/temacProject';
import { getProject } from './projectStorage';

export function serializeProject(project: TemacProject): ExportedWasabiProject {
  const criteria: InclusionExclusionCriterion[] = [
    ...project.inclusionCriteria.map((description, index) => ({ id: `inclusion-${index}`, type: 'inclusion' as const, description })),
    ...project.exclusionCriteria.map((description, index) => ({ id: `exclusion-${index}`, type: 'exclusion' as const, description })),
  ];
  return {
    format: 'wasabi-project', formatVersion: '1.0', appVersion: project.appVersion,
    exportedAt: new Date().toISOString(), project,
    searchStrategy: { descriptors: project.descriptors, searchStrings: project.searchStrings, databases: project.databases, startYear: project.startYear, endYear: project.endYear, knowledgeAreas: project.knowledgeAreas },
    criteria, clusters: project.networks?.flatMap((network) => network.clusters ?? []) ?? [],
  };
}

export async function exportProjectToJson(projectId: string) {
  const project = await getProject(projectId);
  if (!project) throw new Error('PROJECT_NOT_FOUND');
  return JSON.stringify(serializeProject(project), null, 2);
}

export function downloadProject(project: TemacProject) {
  const blob = new Blob([JSON.stringify(serializeProject(project), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${project.title.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'project'}.wasabi.json`; anchor.click();
  URL.revokeObjectURL(url);
}
