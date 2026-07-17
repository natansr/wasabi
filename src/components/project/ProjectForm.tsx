import { Fragment, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { TemacProject } from '../../domain/temacProject';
import { createId } from '../../utils/ids';
import { ScopusCsvHelp } from '../upload/ScopusCsvHelp';

type Props = { project?: TemacProject; onSave: (project: TemacProject) => Promise<void> };
const lines = (value: string) => value.split('\n').map((item) => item.trim()).filter(Boolean);

export function ProjectForm({ project, onSave }: Props) {
  const { t, i18n } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [yearRangeMode, setYearRangeMode] = useState<'automatic' | 'manual'>(
    project?.yearRangeMode ?? (project?.startYear || project?.endYear ? 'manual' : 'automatic'),
  );
  const [form, setForm] = useState({
    title: project?.title ?? '', objective: project?.objective ?? '', researchQuestion: project?.researchQuestion ?? '',
    descriptors: project?.descriptors.join('\n') ?? '', searchStrings: project?.searchStrings.join('\n') ?? '', databases: project?.databases.join('\n') ?? 'Scopus',
    startYear: project?.startYear?.toString() ?? '', endYear: project?.endYear?.toString() ?? '', knowledgeAreas: project?.knowledgeAreas?.join('\n') ?? '',
    inclusionCriteria: project?.inclusionCriteria.join('\n') ?? '', exclusionCriteria: project?.exclusionCriteria.join('\n') ?? '', methodologicalNotes: project?.methodologicalNotes ?? '',
  });
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError('');
    const now = new Date().toISOString();
    try {
      await onSave({
        id: project?.id ?? createId('project'), title: form.title.trim(), objective: form.objective.trim() || undefined, researchQuestion: form.researchQuestion.trim() || undefined,
        descriptors: lines(form.descriptors), searchStrings: lines(form.searchStrings), databases: lines(form.databases),
        startYear: yearRangeMode === 'automatic' ? project?.startYear : form.startYear ? Number(form.startYear) : undefined, endYear: yearRangeMode === 'automatic' ? project?.endYear : form.endYear ? Number(form.endYear) : undefined, yearRangeMode, knowledgeAreas: lines(form.knowledgeAreas),
        inclusionCriteria: lines(form.inclusionCriteria), exclusionCriteria: lines(form.exclusionCriteria), methodologicalNotes: form.methodologicalNotes.trim() || undefined,
        importedRecords: project?.importedRecords ?? [], deduplicatedRecords: project?.deduplicatedRecords ?? [], duplicateGroups: project?.duplicateGroups,
        analysisResults: project?.analysisResults, networks: project?.networks, visualSettings: project?.visualSettings, clusterInterpretations: project?.clusterInterpretations, visualizationNotes: project?.visualizationNotes, reviewSynthesis: project?.reviewSynthesis,
        preferredLanguage: i18n.resolvedLanguage === 'pt-BR' ? 'pt-BR' : 'en-US', createdAt: project?.createdAt ?? now, updatedAt: now, appVersion: '0.1.0',
      });
    } catch { setError(t('errors.saveProject')); } finally { setSaving(false); }
  };
  const fields: Array<{ key: keyof typeof form; multiline?: boolean; type?: string }> = [
    { key: 'title' }, { key: 'objective', multiline: true }, { key: 'researchQuestion', multiline: true }, { key: 'descriptors', multiline: true }, { key: 'searchStrings', multiline: true }, { key: 'databases', multiline: true },
    { key: 'startYear', type: 'number' }, { key: 'endYear', type: 'number' }, { key: 'knowledgeAreas', multiline: true }, { key: 'inclusionCriteria', multiline: true }, { key: 'exclusionCriteria', multiline: true }, { key: 'methodologicalNotes', multiline: true },
  ];
  const sectionBefore: Partial<Record<keyof typeof form, string>> = {
    title: 'identification',
    descriptors: 'search',
    knowledgeAreas: 'selection',
    methodologicalNotes: 'notes',
  };
  const fieldLabel = (key: keyof typeof form, required = false) => (
    <span className="flex items-center gap-2">
      <span>{t(`project.fields.${key}`)}{required ? ' *' : ''}</span>
      <span className="group relative font-sans">
        <button type="button" aria-label={t('project.help.open', { field: t(`project.fields.${key}`) })} className="grid h-5 w-5 place-items-center rounded-full border border-wasabi-300 bg-wasabi-50 text-xs font-bold text-wasabi-700 focus:outline-none focus:ring-2 focus:ring-wasabi-300">?</button>
        <span role="tooltip" className="pointer-events-none absolute left-1/2 top-7 z-20 hidden w-72 -translate-x-1/2 rounded-xl bg-slate-900 p-3 text-xs font-normal leading-5 text-white shadow-xl group-hover:block group-focus-within:block">{t(`project.help.${key}`)}</span>
      </span>
    </span>
  );
  return (
    <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:grid-cols-2">
      {fields.map(({ key, multiline, type }) => {
        if (key === 'endYear') return null;
        if (key === 'startYear') return <fieldset key="yearRange" className="grid gap-4 rounded-xl border border-slate-200 p-4 sm:col-span-2"><legend className="px-2 text-sm font-bold text-slate-700">{t('project.period.title')}</legend><div className="flex flex-wrap gap-5 font-sans text-sm"><label className="flex items-center gap-2"><input type="radio" name="yearRangeMode" checked={yearRangeMode === 'automatic'} onChange={() => setYearRangeMode('automatic')} />{t('project.period.automatic')}</label><label className="flex items-center gap-2"><input type="radio" name="yearRangeMode" checked={yearRangeMode === 'manual'} onChange={() => setYearRangeMode('manual')} />{t('project.period.manual')}</label></div><p className="text-sm leading-6 text-slate-500">{t(`project.period.${yearRangeMode}Help`)}</p><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-semibold text-slate-700"><span>{t('project.fields.startYear')}</span><input type="number" disabled={yearRangeMode === 'automatic'} value={form.startYear} onChange={(event) => update('startYear', event.target.value)} placeholder={yearRangeMode === 'automatic' ? t('project.period.afterImport') : t('project.examples.startYear')} className="rounded-xl border border-slate-200 px-4 py-3 font-normal disabled:bg-slate-100 disabled:text-slate-500" /></label><label className="grid gap-2 text-sm font-semibold text-slate-700"><span>{t('project.fields.endYear')}</span><input type="number" disabled={yearRangeMode === 'automatic'} value={form.endYear} onChange={(event) => update('endYear', event.target.value)} placeholder={yearRangeMode === 'automatic' ? t('project.period.afterImport') : t('project.examples.endYear')} className="rounded-xl border border-slate-200 px-4 py-3 font-normal disabled:bg-slate-100 disabled:text-slate-500" /></label></div></fieldset>;
        const section = sectionBefore[key];
        return <Fragment key={key}>{section && <div className="border-b border-slate-200 pb-3 sm:col-span-2"><h2 className="text-lg font-bold text-wasabi-900">{t(`project.sections.${section}.title`)}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{t(`project.sections.${section}.description`)}</p></div>}{section === 'search' && <div className="sm:col-span-2"><ScopusCsvHelp /></div>}<label className={`grid gap-2 text-sm font-semibold text-slate-700 ${multiline ? 'sm:col-span-2' : ''}`}>{fieldLabel(key, key === 'title')}{multiline ? <textarea value={form[key]} onChange={(event) => update(key, event.target.value)} rows={key === 'methodologicalNotes' ? 5 : 3} placeholder={t(`project.examples.${key}`)} className="rounded-xl border border-slate-200 px-4 py-3 font-normal" /> : <input required={key === 'title'} type={type ?? 'text'} value={form[key]} onChange={(event) => update(key, event.target.value)} placeholder={t(`project.examples.${key}`)} className="rounded-xl border border-slate-200 px-4 py-3 font-normal" />}</label></Fragment>;
      })}
      {error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2"><button disabled={saving} className="rounded-xl bg-wasabi-700 px-6 py-3 font-semibold text-white disabled:opacity-60">{saving ? t('common.saving') : t('common.save')}</button></div>
    </form>
  );
}
