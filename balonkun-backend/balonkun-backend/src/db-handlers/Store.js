"use strict";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const StoreModel = db.stores;
const AddressModel = db.addresses;

/**
 * @method CreateStore: To add new store
 * @param {Object} data store detail
 */
export const CreateStore = (data) => {
    try {
        const { name, email, contact_no } = data;
        return new Promise(async (resolve) => {
            StoreModel.create({ name: name.trim(), email: email.trim(), contact_no: contact_no.trim() })
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.STORE }));
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
 * @method GetStoreList: To fetch stores
 */
export const GetStoreList = (cond = {}) => {
    try {
        return new Promise((resolve) => {
            StoreModel.findAll({ where: cond, include: [{ model: AddressModel }] })
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.STORE }));
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
 * @method UpdateStore: To update existing store
 * @param {Object} detail store detail
 */
export const UpdateStore = (detail) => {
    try {
        const { data, cond } = detail;
        const { name, email, contact_no } = data;
        return new Promise(async (resolve) => {
            StoreModel.update({ name: name.trim(), email: email.trim(), contact_no: contact_no.trim() }, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.STORE }));
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
 * @method DeleteStore: To delete existing store
 * @param {Object} cond store detail
 */
export const DeleteStore = (cond) => {
    try {
        return new Promise((resolve) => {
            StoreModel.destroy({ where: cond })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.STORE }));
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
 * @method GetStore: To fetch store details
 */
export const GetStore = (cond) => {
    try {
        return new Promise((resolve) => {
            StoreModel.findOne({
                where: cond,
                include: [
                    { model: AddressModel }
                ]
            })
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.STORE }));
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
