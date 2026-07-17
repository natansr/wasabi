import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { YearMetric } from '../../domain/analysisResult';
import { EChart } from './EChart';
export function PublicationsByYearChart({ data }: { data: YearMetric[] }) { const { t } = useTranslation(); const option = useMemo(() => ({ tooltip: { trigger: 'axis' }, grid: { left: 48, right: 20, bottom: 40, top: 20 }, xAxis: { type: 'category', data: data.map((item) => item.year) }, yAxis: { type: 'value', minInterval: 1 }, series: [{ data: data.map((item) => item.value), type: 'line', smooth: true, symbolSize: 8, lineStyle: { color: '#286044', width: 3 }, itemStyle: { color: '#286044' }, areaStyle: { color: '#e1eee6' } }] }), [data]); return <EChart option={option} label={t('dashboard.publicationsByYear')} />; }
