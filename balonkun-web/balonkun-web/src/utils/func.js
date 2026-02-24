export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};


export const formatNumberToIndian = (number) => {
  if(!number) {
    return ""
  }

  return Number(number).toLocaleString('en-IN')
}