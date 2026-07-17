export type CriterionType = 'inclusion' | 'exclusion';
export interface InclusionExclusionCriterion { id: string; type: CriterionType; description: string; }
