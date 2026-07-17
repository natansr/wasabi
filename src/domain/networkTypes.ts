export type NetworkType = 'coauthorship' | 'keyword-cooccurrence' | 'bibliographic-coupling' | 'cocitation' | 'citation';
export interface NetworkNode { id: string; label: string; weight: number; clusterId?: string; attributes?: Record<string, string | number | boolean | null>; }
export interface NetworkEdge { id: string; source: string; target: string; weight: number; normalizedWeight?: number; directed?: boolean; }
export interface ClusterSummary { id: string; label?: string; nodeIds: string[]; mainNodes: string[]; keywords?: string[]; }
export interface NetworkMetrics { nodeCount: number; edgeCount: number; density: number; componentCount: number; modularity?: number; }
export interface BibliometricNetwork { id: string; type: NetworkType; nodes: NetworkNode[]; edges: NetworkEdge[]; clusters?: ClusterSummary[]; metrics?: NetworkMetrics; createdAt: string; }
