const apiPaths = {
  getDashboardBlogList: {
    path: 'user/blogs/dashboard'
  },
  getBlogList: {
    path: 'user/blogs?page=1&limit=50'
  },
  getBlog: {
    path: (id) => `user/blogs/${id}`
  },
  getCategoriesBlog: {
    path: (category, pageNumber) => `user/blogs/category?id=${category}&page=${pageNumber}&limit=50`
  },
  getCategories: {
    path: () => 'user/blogs/categories'
  },
  getPopularBlogs: {
    path: () => 'user/blogs/popular'
  },
  getHeaderBlog: {
    path: () => 'user/blogs/header'
  }
};

export default apiPaths;