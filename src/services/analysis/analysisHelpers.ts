import type { RankedMetric } from '../../domain/analysisResult';

export function rank(values: string[], limit = 10): RankedMetric[] {
  const counts = new Map<string, number>();
  for (const value of values.map((item) => item.trim()).filter(Boolean)) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label)).slice(0, limit);
}

export function uniqueCount(values: string[]) { return new Set(values.map((value) => value.trim().toLocaleLowerCase()).filter(Boolean)).size; }
