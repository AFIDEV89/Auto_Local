export const createCopy = (data) => {
  return Object.assign({}, JSON.parse(JSON.stringify(data)));
};

export const removeHypen = (str) => {
  return str.replace(/-/g, " ");
};

export const dataParser = (data) => {
  return JSON.parse(JSON.stringify(data));
};

export const getSwaggerPath = (path) => {
  if (!path) return '';
  const temp = path.split(':');
  const key = temp[temp.length - 1];
  return path.replace(`:${key}`, `{${key}}`);
};
