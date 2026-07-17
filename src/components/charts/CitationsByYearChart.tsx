import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { YearMetric } from '../../domain/analysisResult';
import { EChart } from './EChart';
export function CitationsByYearChart({ data }: { data: YearMetric[] }) { const { t } = useTranslation(); const option = useMemo(() => ({ tooltip: { trigger: 'axis' }, grid: { left: 48, right: 20, bottom: 40, top: 20 }, xAxis: { type: 'category', data: data.map((item) => item.year) }, yAxis: { type: 'value', minInterval: 1 }, series: [{ data: data.map((item) => item.value), type: 'bar', itemStyle: { color: '#4d9369', borderRadius: [5, 5, 0, 0] } }] }), [data]); return <EChart option={option} label={t('dashboard.citationsByYear')} />; }
