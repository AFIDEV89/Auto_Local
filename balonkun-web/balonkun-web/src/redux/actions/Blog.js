import { GET_HEADER_BLOG, GET_POPULAR_BLOGS, GET_CATEGORIES, GET_DASHBOARD_BLOG_LIST_REQUEST, GET_BLOG_LIST_REQUEST, GET_BLOG_REQUEST, GET_CATEGORY_BLOGS } from "../action-types";

export const getDashboardBlogListRequest = (payload, callback) => ({
  type: GET_DASHBOARD_BLOG_LIST_REQUEST,
  payload,
  callback
})

export const getBlogListRequest = (payload, callback) => ({
  type: GET_BLOG_LIST_REQUEST,
  payload,
  callback
})

export const getBlogRequest = (payload, callback) => ({
  type: GET_BLOG_REQUEST,
  payload,
  callback
})

export const getCategoryBlogs = (payload, callback) => ({
  type: GET_CATEGORY_BLOGS,
  payload,
  callback
})

export const getCategories = (payload, callback) => ({
  type: GET_CATEGORIES,
  payload,
  callback
})

export const getPopularBlogs = (payload, callback) => ({
  type: GET_POPULAR_BLOGS,
  payload,
  callback
})

export const getHeaderBlogRequest = (payload, callback) => ({
  type: GET_HEADER_BLOG,
  payload,
  callback
})