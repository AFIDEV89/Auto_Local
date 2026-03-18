export const dateFormatter = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).replace(/([^\s]*\s[^\s]*)\s/, "$1, ");
}
