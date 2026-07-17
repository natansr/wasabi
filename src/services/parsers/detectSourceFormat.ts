export type SourceFormat = 'csv' | 'bibtex' | 'ris' | 'unknown';
export function detectSourceFormat(fileName: string, content = ''): SourceFormat {
  const extension = fileName.toLowerCase().split('.').pop();
  if (extension === 'csv') return 'csv';
  if (extension === 'bib' || extension === 'bibtex') return 'bibtex';
  if (extension === 'ris') return 'ris';
  if (/^\s*@[a-z]+\s*\{/im.test(content)) return 'bibtex';
  return 'unknown';
}
