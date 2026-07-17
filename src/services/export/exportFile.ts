export function downloadText(
  content: string,
  fileName: string,
  type = 'text/plain;charset=utf-8',
) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
export function downloadDataUrl(dataUrl: string, fileName: string) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
export function downloadSvg(element: SVGSVGElement, fileName: string) {
  const clone = element.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  downloadText(
    new XMLSerializer().serializeToString(clone),
    fileName,
    'image/svg+xml;charset=utf-8',
  );
}
export async function downloadPng(
  element: SVGSVGElement,
  fileName: string,
  minimumWidth = 3200,
) {
  const clone = element.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const viewBox = element.viewBox.baseVal;
  const ratio =
    viewBox.width > 0 && viewBox.height > 0
      ? viewBox.height / viewBox.width
      : 0.6;
  const width = minimumWidth;
  const height = Math.round(width * ratio);
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  const source = new Blob([new XMLSerializer().serializeToString(clone)], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(source);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('CANVAS_UNAVAILABLE');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (value) =>
          value ? resolve(value) : reject(new Error('PNG_EXPORT_FAILED')),
        'image/png',
      ),
    );
    const pngUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = pngUrl;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(pngUrl);
  } finally {
    URL.revokeObjectURL(url);
  }
}
