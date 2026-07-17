import type { ExportedWasabiProject, TemacProject } from '../../domain/temacProject';
import { createProject, updateProject } from './projectStorage';

interface WasabiBackup { format: 'wasabi-backup'; formatVersion: string; exportedAt: string; projects: TemacProject[]; }

export function parseWasabiProject(content: string): TemacProject {
  const data: unknown = JSON.parse(content);
  if (!data || typeof data !== 'object' || (data as Partial<ExportedWasabiProject>).format !== 'wasabi-project') throw new Error('INVALID_FORMAT');
  const project = (data as Partial<ExportedWasabiProject>).project;
  if (!project || typeof project.id !== 'string' || typeof project.title !== 'string' || !Array.isArray(project.importedRecords)) throw new Error('INVALID_PROJECT');
  return project;
}

export async function importProjectFromJson(file: File) {
  const project = parseWasabiProject(await file.text());
  try { return await createProject(project); } catch (error) { if (error instanceof DOMException && error.name === 'ConstraintError') return updateProject(project); throw error; }
}

export function parseWasabiBackup(content: string): TemacProject[] {
  const data: unknown = JSON.parse(content); if (!data || typeof data !== 'object' || (data as Partial<WasabiBackup>).format !== 'wasabi-backup' || !Array.isArray((data as Partial<WasabiBackup>).projects)) throw new Error('INVALID_BACKUP');
  const projects = (data as WasabiBackup).projects; if (projects.some((project) => !project || typeof project.id !== 'string' || typeof project.title !== 'string' || !Array.isArray(project.importedRecords))) throw new Error('INVALID_BACKUP'); return projects;
}

export async function importBackupFromJson(file: File) { const projects = parseWasabiBackup(await file.text()); for (const project of projects) { try { await createProject(project); } catch (error) { if (error instanceof DOMException && error.name === 'ConstraintError') await updateProject(project); else throw error; } } return projects; }
