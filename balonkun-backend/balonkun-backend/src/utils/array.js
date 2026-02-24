export function findUniqueValues(arr) {
  if (!(arr?.length)) return [];
  const uniqueValues = [...new Set(arr)];
  return uniqueValues;
}

export function isNonEmptyArray(arr) {
  // Check if arr is an array
  if (!Array.isArray(arr)) {
    return false;
  }

  // Check if arr is not empty
  if (arr.length === 0) {
    return false;
  }

  return true;
}
