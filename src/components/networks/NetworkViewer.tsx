import {
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import type {
  BibliometricNetwork,
  NetworkEdge,
  NetworkNode,
} from '../../domain/networkTypes';
import type { VisualMode } from '../../domain/visualSettings';
import { doiLink, safeExternalLink } from '../../utils/bibliographicLink';

const colors = [
  '#16a34a',
  '#2563eb',
  '#9333ea',
  '#ea580c',
  '#dc2626',
  '#0891b2',
  '#84cc16',
  '#db2777',
];
const initialCamera = { x: 0, y: 0, width: 1000, height: 600 };

export function NetworkViewer({
  network,
  minimumWeight,
  topN,
  mode,
  overlayAttribute,
}: {
  network: BibliometricNetwork;
  minimumWeight: number;
  topN: number;
  mode: VisualMode;
  overlayAttribute: string;
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<NetworkNode>();
  const [selectedEdge, setSelectedEdge] = useState<NetworkEdge>();
  const [hoveredNodeId, setHoveredNodeId] = useState<string>();
  const [camera, setCamera] = useState(initialCamera);
  const [nodePositions, setNodePositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const nodePointer = useRef<
    | {
        id: string;
        x: number;
        y: number;
        nodeX: number;
        nodeY: number;
        scale: number;
      }
    | undefined
  >(undefined);
  const pointer = useRef<
    { x: number; y: number; cameraX: number; cameraY: number } | undefined
  >(undefined);
  const view = useMemo(() => {
    const nodes = [...network.nodes]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, topN);
    const ids = new Set(nodes.map((node) => node.id));
    const edges = network.edges.filter(
      (edge) =>
        edge.weight >= minimumWeight &&
        ids.has(edge.source) &&
        ids.has(edge.target),
    );
    const xs = nodes.map((node) => Number(node.attributes?.x ?? 0));
    const ys = nodes.map((node) => Number(node.attributes?.y ?? 0));
    const minX = Math.min(...xs),
      maxX = Math.max(...xs),
      minY = Math.min(...ys),
      maxY = Math.max(...ys);
    const positioned = nodes.map((node) => ({
      ...node,
      x:
        40 +
        ((Number(node.attributes?.x ?? 0) - minX) / (maxX - minX || 1)) * 920,
      y:
        40 +
        ((Number(node.attributes?.y ?? 0) - minY) / (maxY - minY || 1)) * 520,
    }));
    return {
      nodes: positioned,
      edges,
      positions: new Map(positioned.map((node) => [node.id, node])),
    };
  }, [network, minimumWeight, topN]);
  const overlayValues = view.nodes.map((node) =>
    Number(
      overlayAttribute === 'weight'
        ? node.weight
        : (node.attributes?.[overlayAttribute] ?? 0),
    ),
  );
  const overlayMin = Math.min(...overlayValues);
  const overlayMax = Math.max(...overlayValues);
  const nodeColor = (node: NetworkNode) => {
    if (mode === 'network' && node.clusterId != null)
      return colors[(Number(node.clusterId) - 1) % colors.length];
    if (mode === 'network') return '#16a34a';
    if (mode === 'cluster')
      return colors[(Number(node.clusterId ?? 1) - 1) % colors.length];
    const value = Number(
      overlayAttribute === 'weight'
        ? node.weight
        : (node.attributes?.[overlayAttribute] ?? 0),
    );
    const ratio = (value - overlayMin) / (overlayMax - overlayMin || 1);
    return `hsl(${210 - ratio * 160} 72% ${45 + ratio * 8}%)`;
  };
  const maximumEdgeWeight = Math.max(...view.edges.map((edge) => edge.weight), 1);
  const zoom = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    const factor = event.deltaY > 0 ? 1.15 : 0.85;
    setCamera((current) => {
      const width = Math.min(2000, Math.max(200, current.width * factor));
      const height = width * 0.6;
      return {
        x: current.x + (current.width - width) / 2,
        y: current.y + (current.height - height) / 2,
        width,
        height,
      };
    });
  };
  const zoomBy = (factor: number) => {
    setCamera((current) => {
      const width = Math.min(2000, Math.max(200, current.width * factor));
      const height = width * 0.6;
      return { x: current.x + (current.width - width) / 2, y: current.y + (current.height - height) / 2, width, height };
    });
  };
  const startPan = (event: PointerEvent<SVGSVGElement>) => {
    pointer.current = {
      x: event.clientX,
      y: event.clientY,
      cameraX: camera.x,
      cameraY: camera.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pan = (event: PointerEvent<SVGSVGElement>) => {
    if (nodePointer.current) {
      const drag = nodePointer.current;
      setNodePositions((current) => ({
        ...current,
        [drag.id]: {
          x: drag.nodeX + (event.clientX - drag.x) * drag.scale,
          y: drag.nodeY + (event.clientY - drag.y) * drag.scale,
        },
      }));
      return;
    }
    if (!pointer.current) return;
    const scale = camera.width / event.currentTarget.clientWidth;
    setCamera((current) => ({
      ...current,
      x:
        pointer.current!.cameraX - (event.clientX - pointer.current!.x) * scale,
      y:
        pointer.current!.cameraY - (event.clientY - pointer.current!.y) * scale,
    }));
  };
  const startNodeDrag = (
    event: PointerEvent<SVGGElement>,
    node: { id: string; x: number; y: number },
  ) => {
    event.stopPropagation();
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const position = nodePositions[node.id] ?? node;
    nodePointer.current = {
      id: node.id,
      x: event.clientX,
      y: event.clientY,
      nodeX: position.x,
      nodeY: position.y,
      scale: camera.width / svg.clientWidth,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const position = (id: string) => nodePositions[id] ?? view.positions.get(id);
  const selectedLink = selected
    ? doiLink(String(selected.attributes?.doi ?? '')) ??
      safeExternalLink(String(selected.attributes?.url ?? ''))
    : undefined;
  const edgePath = (
    source: { x: number; y: number },
    target: { x: number; y: number },
    id: string,
  ) => {
    const direction = [...id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 2 ? 1 : -1;
    const middleX = (source.x + target.x) / 2;
    const middleY = (source.y + target.y) / 2;
    const curveX = middleX - (target.y - source.y) * 0.045 * direction;
    const curveY = middleY + (target.x - source.x) * 0.045 * direction;
    return `M ${source.x} ${source.y} Q ${curveX} ${curveY} ${target.x} ${target.y}`;
  };
  const activateWithKeyboard = (
    event: KeyboardEvent<SVGElement>,
    action: () => void,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    action();
  };
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="absolute right-3 top-3 z-10 flex gap-1 rounded-xl border border-slate-200 bg-white/95 p-1 font-sans shadow-sm">
          <button type="button" aria-label={t('networks.zoomIn')} onClick={() => zoomBy(.8)} className="grid h-8 w-8 place-items-center rounded-lg text-lg font-bold hover:bg-wasabi-50">+</button>
          <button type="button" aria-label={t('networks.zoomOut')} onClick={() => zoomBy(1.25)} className="grid h-8 w-8 place-items-center rounded-lg text-lg font-bold hover:bg-wasabi-50">−</button>
          <button type="button" onClick={() => { setCamera(initialCamera); setNodePositions({}); }} className="rounded-lg px-2 text-xs font-semibold hover:bg-wasabi-50">{t('networks.resetView')}</button>
        </div>
        <svg
          id="wasabi-network-svg"
          viewBox={`${camera.x} ${camera.y} ${camera.width} ${camera.height}`}
          onWheel={zoom}
          onPointerDown={startPan}
          onPointerMove={pan}
          onPointerUp={() => {
            pointer.current = undefined;
            nodePointer.current = undefined;
          }}
          className="h-auto min-h-[420px] w-full cursor-grab touch-none active:cursor-grabbing"
          aria-label={t('networks.viewerLabel')}
          role="group"
        >
          <defs>
            <filter id="node-shadow" x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity=".25" />
            </filter>
            <pattern id="network-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#dbe7e1" />
            </pattern>
            <marker
              id="citation-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>
          <rect x={camera.x} y={camera.y} width={camera.width} height={camera.height} fill="#fbfdfc" />
          <rect x={camera.x} y={camera.y} width={camera.width} height={camera.height} fill="url(#network-grid)" opacity=".55" />
          <g>
            {view.edges.map((edge) => {
              const source = position(edge.source);
              const target = position(edge.target);
              const connectedToHover = hoveredNodeId != null && (edge.source === hoveredNodeId || edge.target === hoveredNodeId);
              return source && target ? (
                <path
                  key={edge.id}
                  d={edgePath(source, target, edge.id)}
                  fill="none"
                  stroke={selectedEdge?.id === edge.id || connectedToHover ? '#0f766e' : '#78918b'}
                  strokeOpacity={selectedEdge?.id === edge.id ? 0.95 : connectedToHover ? .8 : hoveredNodeId ? .07 : mode === 'cluster' ? 0.2 : 0.22 + (edge.weight / maximumEdgeWeight) * 0.34}
                  strokeWidth={selectedEdge?.id === edge.id || connectedToHover ? Math.min(8, 1.5 + Math.sqrt(edge.weight) * 1.4) : Math.min(5, 0.45 + Math.sqrt(edge.weight))}
                  markerEnd={
                    network.type === 'citation'
                      ? 'url(#citation-arrow)'
                      : undefined
                  }
                  className="cursor-pointer"
                  tabIndex={0}
                  role="button"
                  aria-label={`${t('networks.source')}: ${network.nodes.find((node) => node.id === edge.source)?.label ?? edge.source}; ${t('networks.target')}: ${network.nodes.find((node) => node.id === edge.target)?.label ?? edge.target}; ${t('networks.weight')}: ${edge.weight}`}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => {
                    setSelectedEdge(edge);
                    setSelected(undefined);
                  }}
                  onKeyDown={(event) =>
                    activateWithKeyboard(event, () => {
                      setSelectedEdge(edge);
                      setSelected(undefined);
                    })
                  }
                />
              ) : null;
            })}
          </g>
          <g>
            {view.nodes.map((node) => (
              <g
                key={node.id}
                transform={`translate(${position(node.id)?.x ?? node.x} ${position(node.id)?.y ?? node.y})`}
                onPointerDown={(event) => startNodeDrag(event, node)}
                onClick={() => {
                  setSelected(node);
                  setSelectedEdge(undefined);
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(undefined)}
                onKeyDown={(event) =>
                  activateWithKeyboard(event, () => {
                    setSelected(node);
                    setSelectedEdge(undefined);
                  })
                }
                tabIndex={0}
                role="button"
                aria-label={`${t('networks.node')}: ${node.label}; ${t('networks.weight')}: ${node.weight}`}
                opacity={hoveredNodeId && hoveredNodeId !== node.id && !view.edges.some((edge) => (edge.source === hoveredNodeId && edge.target === node.id) || (edge.target === hoveredNodeId && edge.source === node.id)) ? .28 : 1}
                className="cursor-pointer transition-opacity duration-200"
              >
                <circle
                  r={Math.min(28, 5 + Math.sqrt(node.weight) * 2.2 + (hoveredNodeId === node.id ? 2 : 0))}
                  fill={nodeColor(node)}
                  stroke={selected?.id === node.id ? '#0f172a' : 'white'}
                  strokeWidth={selected?.id === node.id ? 4 : 2.5}
                  filter="url(#node-shadow)"
                >
                  <title>
                    {node.label}: {node.weight}
                  </title>
                </circle>
                {node.weight >=
                  view.nodes[Math.min(19, view.nodes.length - 1)]?.weight && (
                  <text
                    y={-(Math.min(26, 5 + Math.sqrt(node.weight) * 2.2) + 5)}
                    textAnchor="middle"
                    fontSize={node.weight >= view.nodes[4]?.weight ? 13 : 11}
                    fontWeight="600"
                    fill="#1e293b"
                    stroke="white"
                    strokeWidth="3"
                    paintOrder="stroke"
                  >
                    {node.label.length > 28
                      ? `${node.label.slice(0, 28)}…`
                      : node.label}
                  </text>
                )}
              </g>
            ))}
          </g>
        </svg>
        <p className="border-t border-slate-100 bg-white px-4 py-2 text-center text-xs text-slate-500">{t('networks.interactionHelp')}</p>
      </div>
      <aside className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="font-bold text-slate-800">
          {selectedEdge ? t('networks.edgeDetails') : t('networks.nodeDetails')}
        </h3>
        {selectedEdge ? (
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="text-slate-500">{t('networks.source')}</dt>
              <dd className="font-semibold">
                {network.nodes.find((node) => node.id === selectedEdge.source)
                  ?.label ?? selectedEdge.source}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">{t('networks.target')}</dt>
              <dd className="font-semibold">
                {network.nodes.find((node) => node.id === selectedEdge.target)
                  ?.label ?? selectedEdge.target}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">{t('networks.weight')}</dt>
              <dd className="font-semibold">{selectedEdge.weight}</dd>
            </div>
            {selectedEdge.normalizedWeight != null && (
              <div>
                <dt className="text-slate-500">
                  {t('networks.normalizedWeight')}
                </dt>
                <dd className="font-semibold">
                  {selectedEdge.normalizedWeight.toFixed(4)}
                </dd>
              </div>
            )}
          </dl>
        ) : selected ? (
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="text-slate-500">{t('networks.node')}</dt>
              <dd className="font-semibold">{selected.label}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t('networks.weight')}</dt>
              <dd className="font-semibold">{selected.weight}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t('networks.cluster')}</dt>
              <dd className="font-semibold">{selected.clusterId ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t('networks.degree')}</dt>
              <dd className="font-semibold">
                {String(selected.attributes?.degree ?? '—')}
              </dd>
            </div>
            {selectedLink && (
              <div>
                <dt className="text-slate-500">{t('networks.documentLink')}</dt>
                <dd className="mt-1">
                  <a href={selectedLink} target="_blank" rel="noreferrer" className="inline-flex rounded-lg bg-wasabi-50 px-3 py-2 font-sans font-semibold text-wasabi-700 hover:bg-wasabi-100">
                    {selected.attributes?.doi ? t('networks.openDoi') : t('networks.openPage')} ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            {t('networks.selectNode')}
          </p>
        )}
      </aside>
    </div>
  );
}
