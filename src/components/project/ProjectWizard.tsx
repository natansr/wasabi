import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import type { TemacProject } from '../../domain/temacProject';
import {
  createProject,
  getProject,
  saveActiveProject,
} from '../../services/storage/projectStorage';
import { Header } from '../layout/Header';
import { ProjectForm } from './ProjectForm';
import { UploadArea } from '../upload/UploadArea';
import { ExportPanel } from '../export/ExportPanel';
import { DuplicateReview } from '../upload/DuplicateReview';

const DashboardPage = lazy(() =>
  import('../dashboard/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
);
const NetworkPage = lazy(() =>
  import('../networks/NetworkPage').then((module) => ({
    default: module.NetworkPage,
  })),
);

export function ProjectWizard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState<TemacProject>();
  const [loading, setLoading] = useState(Boolean(projectId));
  const [stage, setStage] = useState<
    'preparation' | 'interrelation' | 'evidence'
  >('preparation');
  useEffect(() => {
    if (projectId)
      void getProject(projectId)
        .then(setProject)
        .finally(() => setLoading(false));
  }, [projectId]);
  const save = async (value: TemacProject) => {
    if (project) await saveActiveProject(value);
    else {
      await createProject(value);
      await saveActiveProject(value);
    }
    navigate('/projects');
  };
  const stages = ['preparation', 'interrelation', 'evidence'] as const;
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-wasabi-500">
          TEMAC
        </p>
        <h1 className="mt-2 text-3xl font-black text-wasabi-900">
          {project?.title ?? t('project.new')}
        </h1>
        {project && (
          <nav className="my-8 flex gap-2 overflow-x-auto border-b border-slate-200">
            {stages.map((item, index) => (
              <button
                key={item}
                onClick={() => setStage(item)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 font-semibold ${stage === item ? 'border-wasabi-700 text-wasabi-900' : 'border-transparent text-slate-500'}`}
              >
                {index + 1}. {t(`temac.stage.${item}`)}
              </button>
            ))}
          </nav>
        )}
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : stage === 'preparation' ? (
          <>
            <p className="mb-8 mt-3 text-slate-600">
              {t('project.formDescription')}
            </p>
            <ProjectForm project={project} onSave={save} />
          </>
        ) : stage === 'interrelation' && project ? (
          <>
            <UploadArea project={project} onSaved={setProject} />
            <DuplicateReview project={project} onSaved={setProject} />
            {project.deduplicatedRecords.length > 0 && (
              <Suspense
                fallback={<p className="mt-8">{t('common.loading')}</p>}
              >
                <DashboardPage project={project} />
              </Suspense>
            )}
          </>
        ) : stage === 'evidence' &&
          project &&
          project.deduplicatedRecords.length > 0 ? (
          <>
            <Suspense fallback={<p>{t('common.loading')}</p>}>
              <NetworkPage project={project} onSaved={setProject} />
            </Suspense>
            <ExportPanel project={project} onSaved={setProject} />
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
            {t('networks.emptyCorpus')}
          </div>
        )}
      </main>
    </div>
  );
}
