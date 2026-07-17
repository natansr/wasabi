import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BibliometricNetwork } from '../../domain/networkTypes';
import type { TemacProject } from '../../domain/temacProject';
import { saveActiveProject } from '../../services/storage/projectStorage';
import type { VisualMode } from '../../domain/visualSettings';

export function EvidenceTable({
  project,
  network,
  mode,
  overlayAttribute,
  minimumWeight,
  topN,
  onSaved,
}: {
  project: TemacProject;
  network: BibliometricNetwork;
  mode: VisualMode;
  overlayAttribute: string;
  minimumWeight: number;
  topN: number;
  onSaved: (project: TemacProject) => void;
}) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState(project.clusterInterpretations ?? {});
  const [visualizationNotes, setVisualizationNotes] = useState(project.visualizationNotes ?? {});
  const visibleNodes = useMemo(() => [...network.nodes].sort((a, b) => b.weight - a.weight).slice(0, topN), [network.nodes, topN]);
  const visibleIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const visibleEdges = network.edges.filter((edge) => edge.weight >= minimumWeight && visibleIds.has(edge.source) && visibleIds.has(edge.target));
  const visibleClusters = (network.clusters ?? []).map((cluster) => ({ ...cluster, nodeIds: cluster.nodeIds.filter((id) => visibleIds.has(id)), mainNodes: cluster.mainNodes.filter((label) => visibleNodes.some((node) => node.label === label)) })).filter((cluster) => cluster.nodeIds.length);
  const viewKey = `${network.type}:${mode}${mode === 'overlay' ? `:${overlayAttribute}` : ''}`;
  if (!network.clusters?.length) return null;
  const save = async (key: string) => {
    if (notes[key] === project.clusterInterpretations?.[key]) return;
    const updated = await saveActiveProject({
      ...project,
      clusterInterpretations: notes,
    });
    onSaved(updated);
  };
  const saveVisualization = async () => {
    if (visualizationNotes[viewKey] === project.visualizationNotes?.[viewKey]) return;
    const updated = await saveActiveProject({ ...project, clusterInterpretations: notes, visualizationNotes });
    onSaved(updated);
  };
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-xl font-bold text-slate-800">
        {t('evidence.title')}
      </h3>
      <p className="mt-2 text-slate-600">{t('evidence.description')}</p>
      <div className="mt-5 rounded-xl border border-wasabi-100 bg-wasabi-50/60 p-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span><strong>{t('evidence.currentNetwork')}:</strong> {t(`networks.types.${network.type}`)}</span>
          <span><strong>{t('evidence.currentMode')}:</strong> {t(`networks.modes.${mode}`)}</span>
          {mode === 'overlay' && <span><strong>{t('evidence.currentOverlay')}:</strong> {t(`networks.overlays.${overlayAttribute}`)}</span>}
          <span><strong>{t('evidence.visibleItems')}:</strong> {visibleNodes.length} {t('networks.metrics.nodes').toLocaleLowerCase()}, {visibleEdges.length} {t('networks.metrics.edges').toLocaleLowerCase()}</span>
        </div>
        <p className="mt-3 text-sm text-slate-600"><strong>{t('evidence.highlightedNodes')}:</strong> {visibleNodes.slice(0, 10).map((node) => node.label).join('; ')}</p>
        <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
          <span>{t('evidence.visualizationInterpretation')}</span>
          <textarea rows={4} value={visualizationNotes[viewKey] ?? ''} onChange={(event) => setVisualizationNotes((current) => ({ ...current, [viewKey]: event.target.value }))} onBlur={() => void saveVisualization()} placeholder={t('evidence.visualizationPlaceholder')} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal" />
        </label>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3">{t('evidence.cluster')}</th>
              <th className="px-4 py-3">{t('evidence.label')}</th>
              <th className="px-4 py-3">{t('evidence.mainNodes')}</th>
              <th className="px-4 py-3">{t('evidence.size')}</th>
              <th className="min-w-80 px-4 py-3">
                {t('evidence.interpretation')}
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleClusters.map((cluster) => {
              const key = `${network.type}:cluster:${cluster.id}`;
              return (
                <tr
                  key={cluster.id}
                  className="border-t border-slate-100 align-top"
                >
                  <td className="px-4 py-3 font-semibold">{cluster.id}</td>
                  <td className="px-4 py-3">{cluster.label}</td>
                  <td className="px-4 py-3">{cluster.mainNodes.join('; ')}</td>
                  <td className="px-4 py-3">{cluster.nodeIds.length}</td>
                  <td className="px-4 py-3">
                    <textarea
                      rows={3}
                      value={notes[key] ?? ''}
                      onChange={(event) =>
                        setNotes((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      onBlur={() => void save(key)}
                      placeholder={t('evidence.placeholder')}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
