import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, SankeyChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';
import { downloadDataUrl, downloadSvg } from '../../services/export/exportFile';

echarts.use([BarChart, LineChart, PieChart, SankeyChart, GridComponent, LegendComponent, TooltipComponent, SVGRenderer, CanvasRenderer]);

export function EChart({ option, label }: { option: EChartsCoreOption; label: string }) {
  const { t } = useTranslation();
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!element.current) return; const chart = echarts.init(element.current, undefined, { renderer: 'svg' }); chart.setOption(option);
    const observer = new ResizeObserver(() => chart.resize()); observer.observe(element.current);
    return () => { observer.disconnect(); chart.dispose(); };
  }, [option]);
  const fileName = `wasabi-${label.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
  const chartSvg = () => element.current?.querySelector('svg');
  const png = () => {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;left:-10000px;top:0;width:1600px;height:900px;background:#fff';
    document.body.appendChild(container);
    const exportChart = echarts.init(container, undefined, { renderer: 'canvas', width: 1600, height: 900 });
    try {
      exportChart.setOption({ ...option, animation: false });
      downloadDataUrl(exportChart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#ffffff' }), `${fileName}.png`);
    } finally {
      exportChart.dispose();
      container.remove();
    }
  };
  return <div><div ref={element} role="img" aria-label={label} className="h-80 w-full" /><div className="flex justify-end gap-2 border-t border-slate-100 px-2 pt-3 font-sans"><button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-wasabi-300" onClick={() => { const svg = chartSvg(); if (svg) downloadSvg(svg, `${fileName}.svg`); }}>{t('dashboard.exportSvg')}</button><button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-wasabi-300" onClick={png}>{t('dashboard.exportPng')}</button></div></div>;
}
