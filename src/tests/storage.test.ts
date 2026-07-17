import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import type { TemacProject } from '../domain/temacProject';
import { parseWasabiBackup, parseWasabiProject } from '../services/storage/importWasabiProject';
import { serializeProject } from '../services/storage/exportWasabiProject';
import { clearLocalData, createProject, duplicateProject, getProject, listProjects, updateProject } from '../services/storage/projectStorage';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}
Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage() });

const project = (): TemacProject => ({
  id: 'project-1', title: 'Review', descriptors: ['science'], searchStrings: [], databases: ['Scopus'], inclusionCriteria: [], exclusionCriteria: [], importedRecords: [], deduplicatedRecords: [], preferredLanguage: 'en-US', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', appVersion: '0.1.0',
});

describe('project storage', () => {
  beforeEach(async () => { await clearLocalData(); });
  it('creates, reads, lists, and updates a project', async () => {
    await createProject(project());
    expect((await getProject('project-1'))?.title).toBe('Review');
    expect(await listProjects()).toHaveLength(1);
    await updateProject({ ...project(), title: 'Updated review' });
    expect((await getProject('project-1'))?.title).toBe('Updated review');
  });
  it('round-trips the .wasabi.json envelope', () => {
    const exported = JSON.stringify(serializeProject(project()));
    expect(parseWasabiProject(exported)).toEqual(project());
  });
  it('rejects an unrelated JSON file', () => {
    expect(() => parseWasabiProject('{"hello":"world"}')).toThrow('INVALID_FORMAT');
  });
  it('duplicates a project with independent identity and dates', async () => {
    await createProject(project()); const copy = await duplicateProject('project-1', 'Review — copy');
    expect(copy.id).not.toBe('project-1'); expect(copy.title).toBe('Review — copy'); expect(await listProjects()).toHaveLength(2);
  });
  it('validates a multi-project backup', () => {
    const content = JSON.stringify({ format: 'wasabi-backup', formatVersion: '1.0', exportedAt: '2026-01-01', projects: [project()] });
    expect(parseWasabiBackup(content)).toEqual([project()]); expect(() => parseWasabiBackup('{"format":"wasabi-backup","projects":[{}]}')).toThrow('INVALID_BACKUP');
  });
});
