import { useTranslation } from 'react-i18next'; import type { RankedMetric } from '../../domain/analysisResult'; import { RankedBarChart } from './RankedBarChart';
export function TopInstitutionsChart({ data }: { data: RankedMetric[] }) { const { t } = useTranslation(); return <RankedBarChart data={data} label={t('dashboard.topInstitutions')} />; }
