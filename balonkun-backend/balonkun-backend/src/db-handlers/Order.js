"use strict";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const OrderModel = db.orders;
const UserModel = db.users;
const StoreModel = db.stores;
const ProductModel = db.products;
const OrderProductModel = db.orderProducts;
const AddressModel = db.addresses;

/**
 * @method CreateOrder: To add new order
 * @param {Object} data order detail
 */
export const CreateOrder = (data) => {
    try {
        return new Promise(async (resolve) => {
            OrderModel.create(data)
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.ORDER }));
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
 * @method DeleteOrder: To delete existing order
 * @param {Object} cond order detail
 */
export const DeleteOrder = (cond) => {
    try {
        return new Promise((resolve) => {
            OrderModel.destroy({ where: cond })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.ORDER }));
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
 * @method GetOrderList: To fetch order
 */
export const GetOrderList = (cond = {}) => {
    try {
        return new Promise((resolve) => {
            OrderModel.findAll({
                where: cond,
                include: [
                    { model: UserModel, attributes: { exclude: ['password', 'login_session_token', 'status', 'type'] } },
                    { model: StoreModel }
                ],
                order: [
                    ['createdAt', 'DESC'],
                ],
            })
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.ORDER }));
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
 * @method UpdateOrder: To update existing order
 * @param {Object} detail order detail
 */
export const UpdateOrder = (detail) => {
    try {
        const { data, cond } = detail;
        return new Promise(async (resolve) => {
            OrderModel.update(data, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.ORDER }));
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
 * @method GetOrder: To fetch order details
 */
export const GetOrder = (cond) => {
    try {
        return new Promise((resolve) => {
            OrderModel.findOne({
                where: cond,
                include: [
                    { model: UserModel, attributes: { exclude: ['password', 'login_session_token', 'status', 'type'] } },
                    {
                        model: StoreModel,
                        include: [
                            { model: AddressModel },
                        ]
                    },
                    {
                        model: OrderProductModel,
                        include: [
                            { model: ProductModel },
                        ]
                    },
                ]
            })
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.ORDER }));
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
