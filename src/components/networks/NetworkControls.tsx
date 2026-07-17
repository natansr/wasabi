import { useTranslation } from 'react-i18next';
import type { NetworkType } from '../../domain/networkTypes';
import type { VisualMode } from '../../domain/visualSettings';

export function NetworkControls({
  type,
  onType,
  mode,
  onMode,
  overlayAttribute,
  onOverlayAttribute,
  minimumWeight,
  onMinimumWeight,
  topN,
  onTopN,
  onGenerate,
  busy,
}: {
  type: NetworkType;
  onType: (type: NetworkType) => void;
  mode: VisualMode;
  onMode: (mode: VisualMode) => void;
  overlayAttribute: string;
  onOverlayAttribute: (attribute: string) => void;
  minimumWeight: number;
  onMinimumWeight: (value: number) => void;
  topN: number;
  onTopN: (value: number) => void;
  onGenerate: () => void;
  busy: boolean;
}) {
  const { t } = useTranslation();
  const types: NetworkType[] = [
    'coauthorship',
    'keyword-cooccurrence',
    'bibliographic-coupling',
    'cocitation',
    'citation',
  ];
  const modes: VisualMode[] = ['network', 'cluster', 'density', 'overlay'];
  const overlays = [
    'weight',
    'citations',
    'degree',
    'weightedDegree',
    'betweenness',
    'year',
  ];
  return (
    <div className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2 lg:grid-cols-3">
      <label className="grid gap-1 text-sm font-semibold">
        <span>{t('networks.controls.type')}</span>
        <select
          value={type}
          onChange={(event) => onType(event.target.value as NetworkType)}
          className="rounded-lg border border-slate-200 px-3 py-2"
        >
          {types.map((item) => (
            <option key={item} value={item}>
              {t(`networks.types.${item}`)}
            </option>
          ))}
        </select>
        <span className="text-xs font-normal leading-5 text-slate-500">{t(`networks.typeHelp.${type}`)}</span>
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        <span>{t('networks.controls.mode')}</span>
        <select
          value={mode}
          onChange={(event) => onMode(event.target.value as VisualMode)}
          className="rounded-lg border border-slate-200 px-3 py-2"
        >
          {modes.map((item) => (
            <option key={item} value={item}>
              {t(`networks.modes.${item}`)}
            </option>
          ))}
        </select>
        <span className="text-xs font-normal leading-5 text-slate-500">{t(`networks.modeHelp.${mode}`)}</span>
      </label>
      {mode === 'overlay' && (
        <label className="grid gap-1 text-sm font-semibold">
          <span>{t('networks.controls.overlay')}</span>
          <select
            value={overlayAttribute}
            onChange={(event) => onOverlayAttribute(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2"
          >
            {overlays.map((item) => (
              <option key={item} value={item}>
                {t(`networks.overlays.${item}`)}
              </option>
            ))}
          </select>
          <span className="text-xs font-normal leading-5 text-slate-500">{t(`networks.overlayHelp.${overlayAttribute}`)}</span>
        </label>
      )}
      <label className="grid gap-1 text-sm font-semibold">
        <span>{t('networks.controls.minimumWeight')}</span>
        <input
          type="number"
          min="1"
          value={minimumWeight}
          onChange={(event) =>
            onMinimumWeight(Math.max(1, Number(event.target.value)))
          }
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <span className="text-xs font-normal leading-5 text-slate-500">{t('networks.controlHelp.minimumWeight')}</span>
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        <span>{t('networks.controls.topN')}</span>
        <input
          type="number"
          min="10"
          max="500"
          value={topN}
          onChange={(event) => onTopN(Math.max(10, Number(event.target.value)))}
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <span className="text-xs font-normal leading-5 text-slate-500">{t('networks.controlHelp.topN')}</span>
      </label>
      <button
        disabled={busy}
        onClick={onGenerate}
        className="self-center rounded-lg bg-wasabi-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {busy
          ? t('networks.controls.calculating')
          : t('networks.controls.generate')}
      </button>
    </div>
  );
}
