"use strict";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const OrderProductModel = db.orderProducts;

/**
 * @method CreateOrderProduct: To add new order products
 * @param {Object} data order detail
 */
export const CreateOrderProduct = (data) => {
    try {
        return new Promise((resolve) => {
            OrderProductModel.bulkCreate(data)
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(
                            Utils.failureError({
                                type: QUERY_TYPE.ADDING,
                                name: MODULE_TYPE.ORDER_PRODUCT,
                            })
                        );
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
