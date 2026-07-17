import { describe, expect, it } from 'vitest';
import type { TFunction } from 'i18next';
import type { TemacProject } from '../domain/temacProject';
import ptBR from '../i18n/locales/pt-BR.json';
import enUS from '../i18n/locales/en-US.json';
import { exportMarkdownReport } from '../services/export/exportMarkdownReport';
import { markdownToPlainText } from '../services/export/exportPdfReport';

function translator(resource: Record<string, unknown>): TFunction { return ((key: string) => key.split('.').reduce<unknown>((value, part) => typeof value === 'object' && value ? (value as Record<string, unknown>)[part] : undefined, resource) ?? key) as TFunction; }
const project: TemacProject = { id: 'p1', title: 'Evidence Review', objective: 'Map evidence', researchQuestion: 'What exists?', descriptors: ['evidence'], searchStrings: ['TITLE(evidence)'], databases: ['Scopus'], startYear: 2020, endYear: 2026, knowledgeAreas: ['Education'], inclusionCriteria: ['Articles'], exclusionCriteria: ['Editorials'], methodologicalNotes: 'TEMAC', importedRecords: [], deduplicatedRecords: [], createdAt: '2026-01-01', updatedAt: '2026-01-01', appVersion: '0.1.0' };

describe('Markdown report', () => {
  it('generates the Portuguese structure without translating user data', () => { const report = exportMarkdownReport(project, translator(ptBR), 'Interpretação', 'pt-BR'); expect(report).toContain('## 1. Identificação do projeto'); expect(report).toContain('Evidence Review'); expect(report).toContain('## 7. Síntese da revisão\nInterpretação'); });
  it('generates the English structure', () => { const report = exportMarkdownReport(project, translator(enUS), '', 'en-US'); expect(report).toContain('## 1. Project identification'); expect(report).toContain('## 8. Methodological record'); });
  it('converts Markdown reports to readable plain text', () => { expect(markdownToPlainText('# Report\n- **Corpus:** 10')).toBe('Report\n• Corpus: 10'); });
});
