"use strict";
import sequelize from "sequelize";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const VehicleCategoryModel = db.vehicle_categories;
const { Op } = sequelize;

/**
 * @method CreateVehicleCategory: To add new vehicle category
 * @param {Object} data vehicle category detail
 */
export const CreateVehicleCategory = (data) => {
    try {
        return new Promise(async (resolve) => {
            const response = await VehicleCategoryModel.findOne({
                where: { name: data.name }
            });
            if (response && response.name) {
                resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.VEHICLE_CATEGORY }));
                return;
            }
            VehicleCategoryModel.create(data)
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.VEHICLE_CATEGORY }));
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
 * @method GetVehicleCategoryList: To fetch vehiclecategorys
 */
export const GetVehicleCategoryList = (limit) => {
    try {
        return new Promise((resolve) => {
            const query = {};
            if (limit) {
                query.limit = limit;
            }
            VehicleCategoryModel.findAll(query)
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.VEHICLE_CATEGORY }));
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
 * @method UpdateVehicleCategory: To update existing vehicle category
 * @param {Object} detail vehicle category detail
 */
export const UpdateVehicleCategory = (detail) => {
    try {
        const { data, cond } = detail;
        return new Promise(async (resolve) => {
            if (data.name) {
                const response = await VehicleCategoryModel.findOne({
                    where: { [Op.and]: [{ name: data.name.trim() }, { id: { [Op.ne]: cond.id } }] }
                });
                if (response?.name) {
                    resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.VEHICLE_CATEGORY }));
                    return;
                }
            }
            VehicleCategoryModel.update(data, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.VEHICLE_CATEGORY }));
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
 * @method DeleteVehicleCategory: To delete existing vehicle category
 * @param {Object} cond vehicle category detail
 */
export const DeleteVehicleCategory = (cond) => {
    try {
        return new Promise((resolve) => {
            VehicleCategoryModel.destroy({ where: cond })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.VEHICLE_CATEGORY }));
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
