import type { BibliometricNetwork } from '../../domain/networkTypes';

export interface DensityPoint { id: string; label: string; weight: number; x: number; y: number; intensity: number; radius: number; }
export function generateDensityMap(network: BibliometricNetwork): DensityPoint[] {
  const weights = network.nodes.map((node) => node.weight); const maxWeight = Math.max(...weights, 1);
  return network.nodes.flatMap((node) => {
    const x = Number(node.attributes?.x); const y = Number(node.attributes?.y); if (!Number.isFinite(x) || !Number.isFinite(y)) return [];
    const intensity = Math.sqrt(node.weight / maxWeight); return [{ id: node.id, label: node.label, weight: node.weight, x, y, intensity, radius: 42 + intensity * 82 }];
  });
}
