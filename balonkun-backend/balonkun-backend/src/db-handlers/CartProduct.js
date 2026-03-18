"use strict";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import { failureError } from "../utils/index.js";

const CartProductModel = db.cartProducts;
const ProductModel = db.products;

/**
 * @method AddProductToCart: To add product to user cart
 * @param {Object} data cart product detail
 */
export const AddProductToCart = (data) => {
    try {
        return new Promise((resolve) => {
            CartProductModel.create(data)
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.CART_PRODUCT }));
                    }
                })
                .catch((error) => {
                    if (error.parent?.errno === 1062) {
                        resolve({ isDuplicate: true });
                    } else {
                        resolve(error.message);
                    }
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method UpdateCartProduct: To update cart product quantity
 * @param {Object} data cart product detail
 */
export const UpdateCartProduct = ({ data, cond }) => {
    try {
        return new Promise((resolve) => {
            CartProductModel.update(data, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.CART_PRODUCT }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method RemoveProductFromCart: To remove product from the cart
 * @param {Object} data cart product detail
 */
export const RemoveProductFromCart = (cond) => {
    try {
        return new Promise((resolve) => {
            CartProductModel.destroy({ where: cond })
                .then((result) => {
                    if (result > 0) {
                        resolve(true);
                    } else {
                        resolve(failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.CART_PRODUCT }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method GetCartProductList: To fetch cart product list
 */
export const GetCartProductList = (cond = {}) => {
    try {
        return new Promise((resolve) => {
            CartProductModel.findAll({ where: cond, include: [{ model: ProductModel }] })
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.CART_PRODUCT }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method GetTotalNoOfCartProducts: To fetch total no. of cart products
 */
export const GetTotalNoOfCartProducts = (cond = {}) => {
    try {
        return new Promise((resolve) => {
            CartProductModel.count({ where: cond })
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: "total no. of " + MODULE_TYPE.CART_PRODUCT + "s" }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};
