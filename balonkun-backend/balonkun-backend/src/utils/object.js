export function isValidNonEmptyObject(obj) {
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj) && Object.keys(obj).length > 0) {
    return true;
  }
  return false;
}
