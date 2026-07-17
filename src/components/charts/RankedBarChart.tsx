import { useMemo } from 'react';
import type { RankedMetric } from '../../domain/analysisResult';
import { EChart } from './EChart';
export function RankedBarChart({ data, label }: { data: RankedMetric[]; label: string }) { const shown = [...data].reverse(); const option = useMemo(() => ({ tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, grid: { left: 16, right: 24, bottom: 24, top: 12, containLabel: true }, xAxis: { type: 'value', minInterval: 1 }, yAxis: { type: 'category', data: shown.map((item) => item.label), axisLabel: { width: 150, overflow: 'truncate' } }, series: [{ type: 'bar', data: shown.map((item) => item.value), itemStyle: { color: '#4d9369', borderRadius: [0, 5, 5, 0] } }] }), [shown]); return <EChart option={option} label={label} />; }
