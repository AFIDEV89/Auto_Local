export default {
  cartProductCreate: {
    path: 'cart-product/create',
  },
  cartProductDelete: {
    path: (id) => `cart-product/delete/${id}`
  },
  cartProductUpdate: {
    path: (id) => `cart-product/update/${id}`
  },
  getCartProductList: {
    path: 'cart-product/get-list',
  },
  getCartProductCount: {
    path: 'cart-product/count',
  },
};

