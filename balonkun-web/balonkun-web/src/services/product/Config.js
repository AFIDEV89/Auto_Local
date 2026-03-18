const ProductPaths = {
  getProductList: {
    path: 'user/product/get-list'
  },
  getProduct: {
    path: (id) => `user/product/${id}`
  },
  getFilterList: {
    path: 'user/product/filters'
  },
  getProductReviews: {
    path: (productId) => `user/product/comments/${productId}`
  },
  getListingSEO: {
    path: (filterString) => `seo?${filterString}`
  },
  getFooterSEO: {
    path: 'seo/footer'
  }
};


export default ProductPaths;