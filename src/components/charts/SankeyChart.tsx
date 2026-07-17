import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { SankeyData } from '../../services/analysis/sankeyAnalysis';
import { EChart } from './EChart';
export function SankeyChart({ data }: { data: SankeyData }) { const { t } = useTranslation(); const option = useMemo(() => ({ tooltip: { trigger: 'item' }, series: [{ type: 'sankey', data: data.nodes, links: data.links, emphasis: { focus: 'adjacency' }, lineStyle: { color: 'gradient', curveness: 0.5 }, itemStyle: { color: '#4d9369' }, label: { color: '#334155' } }] }), [data]); return <EChart option={option} label={t('dashboard.sankey')} />; }
