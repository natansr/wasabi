import type { TemacProject } from '../../domain/temacProject';
import { localPreferences } from './localPreferences';
import { createId } from '../../utils/ids';

const DATABASE_NAME = 'wasabi';
const DATABASE_VERSION = 1;
const PROJECT_STORE = 'projects';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(PROJECT_STORE)) {
        request.result.createObjectStore(PROJECT_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runRequest<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PROJECT_STORE, mode);
    const request = operation(transaction.objectStore(PROJECT_STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

export async function createProject(project: TemacProject) { await runRequest('readwrite', (store) => store.add(project)); return project; }
export async function updateProject(project: TemacProject) { const updated = { ...project, updatedAt: new Date().toISOString() }; await runRequest('readwrite', (store) => store.put(updated)); return updated; }
export async function deleteProject(projectId: string) { await runRequest('readwrite', (store) => store.delete(projectId)); if (localPreferences.getActiveProjectId() === projectId) localPreferences.clearActiveProjectId(); }
export async function listProjects() { const projects = await runRequest<TemacProject[]>('readonly', (store) => store.getAll()); return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); }
export async function getProject(projectId: string) { return runRequest<TemacProject | undefined>('readonly', (store) => store.get(projectId)); }
export async function saveActiveProject(project: TemacProject) { const saved = await updateProject(project); localPreferences.setActiveProjectId(saved.id); return saved; }
export async function getActiveProject() { const id = localPreferences.getActiveProjectId(); return id ? getProject(id) : undefined; }
export async function clearLocalData() { const database = await openDatabase(); database.close(); await new Promise<void>((resolve, reject) => { const request = indexedDB.deleteDatabase(DATABASE_NAME); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); }); localPreferences.clearActiveProjectId(); }
export async function duplicateProject(projectId: string, title: string) { const original = await getProject(projectId); if (!original) throw new Error('PROJECT_NOT_FOUND'); const now = new Date().toISOString(); const copy = structuredClone(original); copy.id = createId('project'); copy.title = title; copy.createdAt = now; copy.updatedAt = now; await createProject(copy); return copy; }
