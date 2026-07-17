export type VisualMode = 'network' | 'cluster' | 'density' | 'overlay';
export interface VisualSettings { mode: VisualMode; minimumEdgeWeight: number; minimumNodeDegree: number; topN: number; hiddenClusterIds?: string[]; overlayAttribute?: string; }
