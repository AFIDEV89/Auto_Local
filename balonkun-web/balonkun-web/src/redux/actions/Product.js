import {
  GET_FOOTER_SEO_DATA,
  GET_LISTING_SEO_DATA,
  GET_PRODUCT_REVIEWS,
  GET_PRODUCT_REQUEST,
  GET_PRODUCT_LIST_REQUEST
} from "../action-types";

export const getProductListRequest = (payload, callback) => ({
  type: GET_PRODUCT_LIST_REQUEST,
  payload,
  callback
});

export const getProductRequest = (payload, callback, errorCb) => ({
  type: GET_PRODUCT_REQUEST,
  payload,
  callback,
  errorCb
});

export const getProductReviewsRequest = (payload, callback) => ({
  type: GET_PRODUCT_REVIEWS,
  payload,
  callback
});

export const getSEOData = (payload, callback) => ({
  type: GET_LISTING_SEO_DATA,
  payload,
  callback
})

export const getFooterSEOData = (payload, callback) => ({
  type: GET_FOOTER_SEO_DATA,
  payload,
  callback
})