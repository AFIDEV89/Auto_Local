export const getPageId = () => {
  const href = window.location.href;
  const id = href.split("/").pop() || "";
  if (Number.isNaN(parseInt(id || ""))) {
    return "";
  }
  return id;
};

export const isValidURL = (link) => {
  const expression =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  const regex = new RegExp(expression);
  return link.match(regex);
};

export const getPageParam = (param) => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param) || '';
};

export function getImageName(url) {
  if (!url) return '';
  const parsedUrl = new URL(url);
  const filename = parsedUrl.pathname.split("/").pop();
  const [name] = filename.split(".");
  return name;
}
