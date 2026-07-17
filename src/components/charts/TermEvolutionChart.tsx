import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TermEvolutionSeries } from '../../services/analysis/termEvolutionAnalysis';
import { EChart } from './EChart';

export function TermEvolutionChart({ data }: { data: TermEvolutionSeries[] }) { const { t } = useTranslation(); const years = [...new Set(data.flatMap((series) => series.values.map((item) => item.year)))].sort(); const option = useMemo(() => ({ tooltip: { trigger: 'axis' }, legend: { type: 'scroll', bottom: 0 }, grid: { left: 42, right: 20, top: 20, bottom: 62 }, xAxis: { type: 'category', data: years }, yAxis: { type: 'value', minInterval: 1 }, series: data.map((series) => ({ name: series.label, type: 'line', smooth: true, data: years.map((year) => series.values.find((item) => item.year === year)?.value ?? 0) })) }), [data, years]); return <EChart option={option} label={t('dashboard.termEvolution')} />; }
