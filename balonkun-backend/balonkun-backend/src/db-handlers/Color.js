"use strict";
import sequelize from "sequelize";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const ColorModel = db.colors;
const { Op } = sequelize;

/**
 * @method CreateColor: To add new color
 * @param {Object} data color detail
 */
export const CreateColor = (data) => {
    try {
        return new Promise(async (resolve) => {
            // const response = await ColorModel.findOne({
            //     where: { name: data.name }
            // });
            // if (response && response.name) {
            //     resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.COLOR }));
            //     return;
            // }
            ColorModel.create(data)
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.COLOR }));
                    }
                })
                .catch((error) => {
                    if (error.parent?.sqlState === '23000') {
                        resolve('Color already exist.');
                    }
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method GetColorList: To fetch colors
 */
export const GetColorList = (cond, attributes) => {
    try {
        const query = { where: cond || {} };
        if (attributes?.length) {
            query.attributes = attributes;
        }
        return new Promise((resolve) => {
            ColorModel.findAll(query)
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.COLOR }));
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
 * @method UpdateColor: To update existing color
 * @param {Object} detail color detail
 */
export const UpdateColor = (detail) => {
    try {
        const { data, cond } = detail;
        return new Promise(async (resolve) => {
            if (data.name) {
                const response = await ColorModel.findOne({
                    where: { [Op.and]: [{ name: data.name.trim() }, { id: { [Op.ne]: cond.id } }] }
                });
                if (response && response.name) {
                    resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.COLOR }));
                    return;
                }
            }
            ColorModel.update(data, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.COLOR }));
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
 * @method DeleteColor: To delete existing color
 * @param {Object} cond color detail
 */
export const DeleteColor = (cond) => {
    try {
        return new Promise((resolve) => {
            ColorModel.destroy({ where: cond })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.COLOR }));
                    }
                })
                .catch((error) => {
                    let errMessage = error.message;
                    if (error.parent?.errno === 1451) {
                        errMessage = "You can't perform this action, because you have selected this color in products.";
                    }
                    resolve(errMessage);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};
