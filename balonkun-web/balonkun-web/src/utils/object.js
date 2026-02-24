export function filteredObj(params) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
  );
};
