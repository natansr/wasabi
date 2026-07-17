import { useTranslation } from 'react-i18next';
import type { BibliometricNetwork } from '../../domain/networkTypes';
import {
  downloadPng,
  downloadSvg,
  downloadText,
} from '../../services/export/exportFile';
import {
  networkEdgesToCsv,
  networkNodesToCsv,
  networkToJson,
} from '../../services/export/exportNetwork';
import {
  networkToGexf,
  networkToGraphML,
} from '../../services/export/exportGraphFormats';

export function NetworkExportActions({
  network,
}: {
  network: BibliometricNetwork;
}) {
  const { t } = useTranslation();
  const name = `wasabi-${network.type}`;
  const button =
    'rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-wasabi-300';
  const svg = () => {
    const element = document.getElementById('wasabi-network-svg');
    if (element instanceof SVGSVGElement) downloadSvg(element, `${name}.svg`);
  };
  const png = () => {
    const element = document.getElementById('wasabi-network-svg');
    if (element instanceof SVGSVGElement)
      void downloadPng(element, `${name}.png`);
  };
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-bold text-slate-800">{t('networks.exports.title')}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{t('networks.exports.description')}</p>
      <div className="mt-4 flex flex-wrap gap-2">
      <button
        className={button}
        onClick={() =>
          downloadText(
            networkNodesToCsv(network),
            `${name}-nodes.csv`,
            'text/csv;charset=utf-8',
          )
        }
      >
        {t('networks.exports.nodes')}
      </button>
      <button
        className={button}
        onClick={() =>
          downloadText(
            networkEdgesToCsv(network),
            `${name}-edges.csv`,
            'text/csv;charset=utf-8',
          )
        }
      >
        {t('networks.exports.edges')}
      </button>
      <button
        className={button}
        onClick={() =>
          downloadText(
            networkToJson(network),
            `${name}.json`,
            'application/json',
          )
        }
      >
        {t('networks.exports.json')}
      </button>
      <button
        className={button}
        onClick={() =>
          downloadText(
            networkToGraphML(network),
            `${name}.graphml`,
            'application/xml',
          )
        }
      >
        {t('networks.exports.graphml')}
      </button>
      <button
        className={button}
        onClick={() =>
          downloadText(
            networkToGexf(network),
            `${name}.gexf`,
            'application/xml',
          )
        }
      >
        {t('networks.exports.gexf')}
      </button>
      <button className={button} onClick={svg}>
        {t('networks.exports.svg')}
      </button>
      <button className={button} onClick={png}>
        {t('networks.exports.png')}
      </button>
      </div>
    </section>
  );
}
