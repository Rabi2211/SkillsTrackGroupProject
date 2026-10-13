export function isPdfFile(file) {
  if (!file || !file.name) {
    return false;
  }

  const fileName = file.name.toLowerCase();
  return file.type === 'application/pdf' || fileName.endsWith('.pdf');
}

export function buildResourceStoragePath(fileName) {
  const safeName = String(fileName || 'resource.pdf')
    .replace(/\.[^/.]+$/, '')
    .trim()
    .replace(/[^a-zA-Z0-9\-_ ]/g, ' ')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '') || 'resource';

  const extension = String(fileName || 'resource.pdf').toLowerCase().endsWith('.pdf') ? '.pdf' : '.pdf';
  return `resources/${Date.now()}_${safeName}${extension}`;
}
