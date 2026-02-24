import config from './Config';
import { getDataApi } from '../ApiCaller';

export const getDashboardBlogList = (params) => {
  const request = config.getDashboardBlogList;

  return getDataApi({
    path: request.path
  });
};

export const getBlogList = (params) => {
  const request = config.getBlogList;

  return getDataApi({
    path: request.path
  });
};

export const getBlog = (id) => {
  const request = config.getBlog;

  return getDataApi({
    path: request.path(id)
  });
};

export const getCategoriesBlog = (params) => {
  const { category, page } = params;
  const request = config.getCategoriesBlog;
  
  return getDataApi({
    path: request.path(category, page)
  });
};

export const getCategories = () => {
  const request = config.getCategories;

  return getDataApi({
    path: request.path()
  });
}

export const getPopularBlogs = () => {
  const request = config.getPopularBlogs;

  return getDataApi({
    path: request.path()
  });
}

export const getHeaderBlog = () => {
  const request = config.getHeaderBlog;

  return getDataApi({
    path: request.path()
  });
}