export const addThreeDots = (value, len = 50) => {
  if (!value || value.length < len) return titleCase(value);
  return titleCase(value).slice(0, len) + '...';
};

export const titleCase = (value) => {
  if (!value) return value;
  const words = value.split(' ');
  words[0] = words[0].slice(0, 1).toUpperCase() + words[0].slice(1).toLowerCase();
  return words.join(' ');
};
