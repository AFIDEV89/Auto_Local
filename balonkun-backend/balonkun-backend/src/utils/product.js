export function getProductPrice(product) {
  return product.discounted_price || product.original_price;
}
