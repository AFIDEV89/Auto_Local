"use strict";
import sequelize from "sequelize";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const VehicleDetailsModel = db.vehicleDetails;
const VehicleTypeModel = db.vehicleTypes;
const BrandModel = db.brands;
const ModelModel = db.brandModels;
const VehicleCategoryModel = db.vehicle_categories;
const { Op } = sequelize;

/**
 * @method CreateVehicleDetail: To add new vehicle details
 * @param {Object} data category detail
 */
export const CreateVehicleDetail = async (data) => {
    try {
        // const { brand_id, model_id, month, year } = data;
        return new Promise(async (resolve) => {
            // const response = await VehicleDetailsModel.findOne({
            //     where: { brand_id, model_id, month, year }
            // });
            // if (response?.brand_id) {
            //     resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.VEHICLE_DETAIL }));
            //     return;
            // }
            VehicleDetailsModel.create(data)
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.VEHICLE_DETAIL }));
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
 * @method GetVehicleDetailsList: To fetch categories
 */
export const GetVehicleDetailList = (attributes) => {
    try {
        const query = {
            include:
                [
                    { model: BrandModel, attributes: ['id', 'name'] },
                    { model: VehicleTypeModel, attributes: ['id', 'name'] },
                    { model: ModelModel, attributes: ['id', 'name', 'brand_id'] },
                    { model: VehicleCategoryModel, attributes: ['id', 'name'] }
                ]
        };
        if (attributes?.length) {
            query.attributes = attributes;
        }
        return new Promise((resolve) => {
            VehicleDetailsModel.findAll(query)
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.VEHICLE_DETAIL }));
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
 * @method UpdateVehicleDetail: To update existing category
 * @param {Object} detail category detail
 */
export const UpdateVehicleDetail = (detail) => {
    try {
        const { data, cond } = detail;
        return new Promise(async (resolve) => {
            const { brand_id, model_id, month = '', year = '' } = data;
            if (brand_id && model_id && month && year) {
                const response = await VehicleDetailsModel.findOne({
                    where: {
                        [Op.and]: [{ brand_id }, { model_id }, { month }, { year }, { id: { [Op.ne]: cond.id } }]
                    }
                });
                if (response && response.model_id) {
                    resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.VEHICLE_DETAIL }));
                    return;
                }
            }
            VehicleDetailsModel.update(data, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.VEHICLE_DETAIL }));
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
 * @method DeleteVehicleDetail: To delete existing category
 * @param {Object} cond category detail
 */
export const DeleteVehicleDetail = (cond) => {
    try {
        return new Promise((resolve) => {
            VehicleDetailsModel.destroy({ where: cond })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.VEHICLE_DETAIL }));
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
 * @method GetVehicleTypeList: To fetch vehicle type list
 */
export const GetVehicleTypeList = (attributes) => {
    try {
        const query = {};
        if (attributes?.length) {
            query.attributes = attributes;
        }
        return new Promise((resolve) => {
            VehicleTypeModel.findAll(query)
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.VEHICLE_TYPE }));
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
 * @method CreateManyVehicleDetail: To add multiple vehicle details
 * @param {Object} data category detail
 */
export const CreateManyVehicleDetail = async (data) => {
    try {
        return new Promise(async (resolve) => {
            VehicleDetailsModel.bulkCreate(data)
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.VEHICLE_DETAIL }));
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
