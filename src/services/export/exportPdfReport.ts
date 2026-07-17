export function markdownToPlainText(markdown: string) {
  return markdown
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^\s*-\s+/gm, '• ')
    .replace(/_([^_]+)_/g, '$1');
}

export async function downloadPdfReport(markdown: string, fileName: string) {
  const { jsPDF } = await import('jspdf');
  const document = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const margin = 18;
  const pageWidth = document.internal.pageSize.getWidth();
  const pageHeight = document.internal.pageSize.getHeight();
  const lines = document.splitTextToSize(markdownToPlainText(markdown), pageWidth - margin * 2) as string[];
  let y = margin;
  document.setFont('helvetica', 'normal');
  document.setFontSize(10.5);
  for (const line of lines) {
    if (y > pageHeight - margin) {
      document.addPage();
      y = margin;
    }
    document.text(line, margin, y);
    y += 5;
  }
  document.save(fileName);
}
