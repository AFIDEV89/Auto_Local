"use strict";
import sequelize from "sequelize";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const MaterialModel = db.materials;
const { Op } = sequelize;

/**
 * @method CreateMaterial: To add new material
 * @param {Object} data material detail
 */
export const CreateMaterial = (data) => {
    try {
        return new Promise(async (resolve) => {
            // const response = await MaterialModel.findOne({
            //     where: { name: data.name }
            // });
            // if (response && response.name) {
            //     resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.MATERIAL }));
            //     return;
            // }
            MaterialModel.create(data)
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.MATERIAL }));
                    }
                })
                .catch((error) => {
                    if (error.parent?.sqlState === '23000') {
                        resolve('Material already exist.');
                    }
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method GetMaterialList: To fetch material
 */
export const GetMaterialList = (cond, attributes) => {
    try {
        const query = { where: cond || {} };
        if (attributes?.length) {
            query.attributes = attributes;
        }
        return new Promise((resolve) => {
            MaterialModel.findAll(query)
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.MATERIAL }));
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
 * @method UpdateMaterial: To update existing material
 * @param {Object} detail material detail
 */
export const UpdateMaterial = (detail) => {
    try {
        const { data, cond } = detail;
        return new Promise(async (resolve) => {
            if (data.name) {
                const response = await MaterialModel.findOne({
                    where: { [Op.and]: [{ name: data.name.trim() }, { id: { [Op.ne]: cond.id } }] }
                });
                if (response && response.name) {
                    resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.MATERIAL }));
                    return;
                }
            }
            MaterialModel.update(data, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.MATERIAL }));
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
 * @method DeleteMaterial: To delete existing material
 * @param {Object} cond material detail
 */
export const DeleteMaterial = (cond) => {
    try {
        return new Promise((resolve) => {
            MaterialModel.destroy({ where: cond })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.MATERIAL }));
                    }
                })
                .catch((error) => {
                    let errMessage = error.message;
                    if (error.parent?.errno === 1451) {
                        errMessage = "You can't perform this action, because you have selected this material in products.";
                    }
                    resolve(errMessage);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};
