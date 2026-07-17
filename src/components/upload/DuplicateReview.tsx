import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TemacProject } from '../../domain/temacProject';
import { descriptiveAnalysis } from '../../services/analysis/descriptiveAnalysis';
import { saveActiveProject } from '../../services/storage/projectStorage';

export function DuplicateReview({
  project,
  onSaved,
}: {
  project: TemacProject;
  onSaved: (project: TemacProject) => void;
}) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState('');
  const groups = project.duplicateGroups ?? [];
  const records = new Map(
    project.importedRecords.map((record) => [record.id, record]),
  );
  if (!groups.length) return null;
  const retain = async (groupId: string, recordId: string) => {
    const group = groups.find((item) => item.id === groupId);
    const selected = records.get(recordId);
    if (!group || !selected || group.retainedRecordId === recordId) return;
    setSaving(groupId);
    const deduplicatedRecords = project.deduplicatedRecords.map((record) =>
      record.id === group.retainedRecordId ? selected : record,
    );
    const duplicateGroups = groups.map((item) =>
      item.id === groupId ? { ...item, retainedRecordId: recordId } : item,
    );
    const updated = await saveActiveProject({
      ...project,
      deduplicatedRecords,
      duplicateGroups,
      analysisResults: descriptiveAnalysis(
        project.importedRecords,
        deduplicatedRecords,
      ),
    });
    onSaved(updated);
    setSaving('');
  };
  return (
    <details className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <summary className="cursor-pointer text-lg font-bold text-amber-950">
        {t('duplicates.title', { count: groups.length })}
      </summary>
      <p className="mt-2 text-sm text-amber-900">
        {t('duplicates.description')}
      </p>
      <div className="mt-5 grid gap-4">
        {groups.map((group, index) => (
          <article
            key={group.id}
            className="rounded-xl border border-amber-200 bg-white p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-slate-800">
                {t('duplicates.group', { number: index + 1 })}
              </h3>
              <span className="rounded-full bg-amber-100 px-3 py-1 font-sans text-xs font-semibold text-amber-900">
                {t(`duplicates.confidence.${group.confidence}`)} ·{' '}
                {t(`duplicates.match.${group.matchedBy}`)}
              </span>
            </div>
            <fieldset className="mt-4 grid gap-3">
              <legend className="mb-2 text-sm font-semibold text-slate-700">
                {t('duplicates.choose')}
              </legend>
              {group.recordIds.map((recordId) => {
                const record = records.get(recordId);
                if (!record) return null;
                return (
                  <label
                    key={recordId}
                    className={`flex cursor-pointer gap-3 rounded-lg border p-3 ${group.retainedRecordId === recordId ? 'border-wasabi-500 bg-wasabi-50' : 'border-slate-200'}`}
                  >
                    <input
                      type="radio"
                      name={group.id}
                      checked={group.retainedRecordId === recordId}
                      disabled={saving === group.id}
                      onChange={() => void retain(group.id, recordId)}
                    />
                    <span>
                      <strong className="block text-slate-800">
                        {record.title || t('duplicates.untitled')}
                      </strong>
                      <span className="mt-1 block text-sm text-slate-600">
                        {record.authors.join('; ') || '—'} ·{' '}
                        {record.year ?? '—'} ·{' '}
                        {record.doi ?? t('duplicates.noDoi')}
                      </span>
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </article>
        ))}
      </div>
    </details>
  );
}
