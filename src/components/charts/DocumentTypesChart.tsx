import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { RankedMetric } from '../../domain/analysisResult';
import { EChart } from './EChart';
export function DocumentTypesChart({ data }: { data: RankedMetric[] }) { const { t } = useTranslation(); const option = useMemo(() => ({ tooltip: { trigger: 'item' }, legend: { bottom: 0, type: 'scroll' }, series: [{ type: 'pie', radius: ['40%', '68%'], center: ['50%', '43%'], data: data.map((item) => ({ name: item.label, value: item.value })), label: { show: false }, color: ['#153e35', '#286044', '#4d9369', '#9ac5a9', '#cbd5e1'] }] }), [data]); return <EChart option={option} label={t('dashboard.documentTypes')} />; }
