import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { TemacProject } from '../../domain/temacProject';
import {
  deleteProject,
  duplicateProject,
  listProjects,
} from '../../services/storage/projectStorage';
import { downloadProject } from '../../services/storage/exportWasabiProject';
import { importProjectFromJson } from '../../services/storage/importWasabiProject';
import { Header } from '../layout/Header';

export function ProjectList() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<TemacProject[]>([]);
  const [message, setMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const refresh = () => void listProjects().then(setProjects);
  useEffect(refresh, []);
  const remove = async (project: TemacProject) => {
    if (!confirm(t('project.confirmDelete', { title: project.title }))) return;
    await deleteProject(project.id);
    refresh();
  };
  const duplicate = async (project: TemacProject) => {
    await duplicateProject(project.id, t('project.copyTitle', { title: project.title }));
    setMessage(t('success.projectDuplicated'));
    refresh();
  };
  const importFile = async (file?: File) => {
    if (!file) return;
    try {
      await importProjectFromJson(file);
      setMessage(t('success.projectImported'));
      refresh();
    } catch {
      setMessage(t('errors.invalidProject'));
    }
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-black text-wasabi-900">
              {t('project.listTitle')}
            </h1>
            <p className="mt-2 text-slate-600">
              {t('project.listDescription')}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/projects/new"
              className="rounded-xl bg-wasabi-700 px-5 py-3 font-semibold text-white"
            >
              {t('home.newProject')}
            </Link>
            <button
              onClick={() => fileInput.current?.click()}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold"
            >
              {t('home.importProject')}
            </button>
            <input
              ref={fileInput}
              className="hidden"
              type="file"
              accept=".json,.wasabi.json,application/json"
              onChange={(event) => void importFile(event.target.files?.[0])}
            />
          </div>
        </div>
        <p className="mt-6 rounded-xl bg-wasabi-100 p-4 text-sm text-wasabi-900">
          {t('privacy.localProcessing')}
        </p>
        {message && (
          <p role="status" className="mt-4 font-semibold text-wasabi-700">
            {message}
          </p>
        )}
        <div className="mt-8 grid gap-4">
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
              {t('project.empty')}
            </div>
          ) : (
            projects.map((project) => (
              <article
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {t('project.updatedAt', {
                      date: new Intl.DateTimeFormat(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }).format(new Date(project.updatedAt)),
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/projects/${project.id}`}
                    className="rounded-lg bg-wasabi-100 px-4 py-2 font-semibold text-wasabi-900"
                  >
                    {t('common.open')}
                  </Link>
                  <button
                    onClick={() => downloadProject(project)}
                    className="rounded-lg border border-slate-200 px-4 py-2 font-semibold"
                  >
                    {t('common.export')}
                  </button>
                  <button
                    onClick={() => void duplicate(project)}
                    className="rounded-lg border border-slate-200 px-4 py-2 font-semibold"
                  >
                    {t('common.duplicate')}
                  </button>
                  <button
                    onClick={() => void remove(project)}
                    className="rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-700"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
