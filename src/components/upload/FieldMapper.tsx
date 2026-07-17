import { useTranslation } from 'react-i18next';
import { bibliographicFields, type FieldMapping } from '../../services/parsers/fieldMapping';

type Props = { headers: string[]; mapping: FieldMapping; onChange: (mapping: FieldMapping) => void };
export function FieldMapper({ headers, mapping, onChange }: Props) {
  const { t } = useTranslation();
  return <details className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-bold text-slate-800">{t('import.fieldMapping')}</summary><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{bibliographicFields.map((field) => <label key={field} className="grid gap-1 text-sm font-semibold text-slate-700"><span>{t(`import.fields.${field}`)}</span><select value={mapping[field] ?? ''} onChange={(event) => onChange({ ...mapping, [field]: event.target.value || undefined })} className="rounded-lg border border-slate-200 px-3 py-2 font-normal"><option value="">{t('import.notMapped')}</option>{headers.map((header) => <option key={header}>{header}</option>)}</select></label>)}</div></details>;
}
