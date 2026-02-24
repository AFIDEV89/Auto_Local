import {
  CART_PRODUCT_CREATE,
  CART_PRODUCT_DELETE,
  CART_PRODUCT_UPDATE,
  GET_CART_PRODUCT_REQUEST,
  GET_CART_PRODUCT_COUNT,
  GET_CART_PRODUCT_COUNT_SUCCESS,
  RESET_CART_PRODUCT_COUNT
} from "@redux/action-types";

export const cartProductCreate = (payload, callback) => ({
  type: CART_PRODUCT_CREATE,
  payload,
  callback
});

export const cartProductDelete = (payload, callback) => ({
  type: CART_PRODUCT_DELETE,
  payload,
  callback
});

export const cartProductUpdate = (payload, callback) => ({
  type: CART_PRODUCT_UPDATE,
  payload,
  callback
});

export const getCartProductRequest = (callback) => ({
  type: GET_CART_PRODUCT_REQUEST,
  callback
});

export const getCartProductCount = () => ({
  type: GET_CART_PRODUCT_COUNT,
});

export const getCartProductCountSuccess = (payload) => ({
  type: GET_CART_PRODUCT_COUNT_SUCCESS,
  payload
});

export const resetCartProductCount = () => ({
  type: RESET_CART_PRODUCT_COUNT
});
