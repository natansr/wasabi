export function createId(prefix = 'wasabi') {
  return `${prefix}-${crypto.randomUUID()}`;
}
