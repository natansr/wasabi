import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  BibliometricNetwork,
  NetworkType,
} from '../../domain/networkTypes';
import type { TemacProject } from '../../domain/temacProject';
import type { VisualMode } from '../../domain/visualSettings';
import { runNetworkAnalysis } from '../../services/networks/runNetworkAnalysis';
import { saveActiveProject } from '../../services/storage/projectStorage';
import { MetricCard } from '../dashboard/MetricCard';
import { NetworkControls } from './NetworkControls';
import { NetworkViewer } from './NetworkViewer';
import { ClusterLegend } from './ClusterLegend';
import { DensityView } from './DensityView';
import { NetworkExportActions } from './NetworkExportActions';
import { EvidenceTable } from './EvidenceTable';

export function NetworkPage({
  project,
  onSaved,
}: {
  project: TemacProject;
  onSaved: (project: TemacProject) => void;
}) {
  const { t } = useTranslation();
  const [type, setType] = useState<NetworkType>('coauthorship');
  const [mode, setMode] = useState<VisualMode>('network');
  const [overlayAttribute, setOverlayAttribute] = useState('degree');
  const [minimumWeight, setMinimumWeight] = useState(1);
  const [topN, setTopN] = useState(100);
  const [network, setNetwork] = useState<BibliometricNetwork>();
  const [busy, setBusy] = useState(false);
  const generate = async () => {
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    try {
      const calculated = await runNetworkAnalysis(
        type,
        project.deduplicatedRecords,
      );
      setNetwork(calculated);
      const networks = [
        ...(project.networks ?? []).filter((item) => item.type !== type),
        calculated,
      ];
      const updated = await saveActiveProject({ ...project, networks });
      onSaved(updated);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section>
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-widest text-wasabi-500">
          {t('networks.eyebrow')}
        </p>
        <h2 className="mt-2 text-3xl font-black text-wasabi-900">
          {t('networks.title')}
        </h2>
        <p className="mt-2 text-slate-600">{t('networks.description')}</p>
        {project.deduplicatedRecords.length > 100 && (
          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            {t('networks.performanceWarning')}
          </p>
        )}
      </div>
      <NetworkControls
        type={type}
        onType={setType}
        mode={mode}
        onMode={setMode}
        overlayAttribute={overlayAttribute}
        onOverlayAttribute={setOverlayAttribute}
        minimumWeight={minimumWeight}
        onMinimumWeight={setMinimumWeight}
        topN={topN}
        onTopN={setTopN}
        onGenerate={() => void generate()}
        busy={busy}
      />
      <div className="mt-4 rounded-2xl border border-wasabi-100 bg-wasabi-50/70 p-5">
        <h3 className="font-bold text-wasabi-900">{t('networks.guide.title')}</h3>
        <dl className="mt-3 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {(['node', 'edge', 'weight', 'cluster'] as const).map((item) => (
            <div key={item}>
              <dt className="font-semibold text-slate-800">{t(`networks.guide.${item}.term`)}</dt>
              <dd className="mt-1 leading-5 text-slate-600">{t(`networks.guide.${item}.description`)}</dd>
            </div>
          ))}
        </dl>
      </div>
      {network && (
        <div className="mt-6 grid gap-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <MetricCard
              label={t('networks.metrics.nodes')}
              value={network.metrics?.nodeCount ?? 0}
            />
            <MetricCard
              label={t('networks.metrics.edges')}
              value={network.metrics?.edgeCount ?? 0}
            />
            <MetricCard
              label={t('networks.metrics.density')}
              value={(network.metrics?.density ?? 0).toFixed(4)}
            />
            <MetricCard
              label={t('networks.metrics.components')}
              value={network.metrics?.componentCount ?? 0}
            />
            <MetricCard
              label={t('networks.metrics.modularity')}
              value={(network.metrics?.modularity ?? 0).toFixed(4)}
            />
          </div>
          {mode === 'density' ? (
            <DensityView network={network} topN={topN} />
          ) : (
            <NetworkViewer
              network={network}
              minimumWeight={minimumWeight}
              topN={topN}
              mode={mode}
              overlayAttribute={overlayAttribute}
            />
          )}
          {mode === 'cluster' && network.clusters && (
            <ClusterLegend clusters={network.clusters} />
          )}
          <NetworkExportActions network={network} />
          <EvidenceTable
            project={project}
            network={network}
            mode={mode}
            overlayAttribute={overlayAttribute}
            minimumWeight={minimumWeight}
            topN={topN}
            onSaved={onSaved}
          />
        </div>
      )}
    </section>
  );
}
