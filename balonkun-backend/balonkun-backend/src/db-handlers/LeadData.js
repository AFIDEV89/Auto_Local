"use strict";
import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const BrandModel = db.brands;

/**
 * @method CreateBrand: To add new brand
 * @param {Object} data brand detail
 */
export const CreateBrand = (data) => {
    try {
        return new Promise(async (resolve) => {
            BrandModel.create(data)
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.BRAND }));
                    }
                })
                .catch((error) => {
                    if (error.parent?.sqlState === '23000') {
                        resolve('Brand already exist.');
                    }
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method GetBrandList: To fetch brands
 */
export const GetBrandList = (cond, attributes) => {
    try {
        const query = { where: cond || {} };
        if (attributes?.length) {
            query.attributes = attributes;
        }
        return new Promise((resolve) => {
            BrandModel.findAll(query)
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.BRAND }));
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
 * @method UpdateBrand: To update existing brand
 * @param {Object} detail brand detail
 */
export const UpdateBrand = (detail) => {
    try {
        const { data, cond } = detail;
        return new Promise(async (resolve) => {
            BrandModel.update(data, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.BRAND }));
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
 * @method DeleteBrand: To delete existing brand
 * @param {Object} cond brand detail
 */
export const DeleteBrand = (cond) => {
    try {
        return new Promise((resolve) => {
            BrandModel.destroy({ where: cond })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.BRAND }));
                    }
                })
                .catch((error) => {
                    let errMessage = error.message;
                    if (error.parent?.errno === 1451) {
                        errMessage = "You can't perform this action, because you have selected this brand in products.";
                    }
                    resolve(errMessage);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};
