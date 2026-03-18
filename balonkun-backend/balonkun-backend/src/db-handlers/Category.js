"use strict";
import sequelize from "sequelize";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const CategoryModel = db.categories;
const { Op } = sequelize;

/**
 * @method CreateCategory: To add new category
 * @param {Object} data category detail
 */
export const CreateCategory = async (data) => {
    try {
        return new Promise(async (resolve) => {
            const response = await CategoryModel.findOne({
                where: { name: data.name.trim() }
            });
            if (response?.name) {
                resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.CATEGORY }));
                return;
            }
            CategoryModel.create(data)
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.CATEGORY }));
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
 * @method GetCategoryList: To fetch categories
 */
export const GetCategoryList = (cond, attributes) => {
    try {
        const query = { where: cond || {} };
        if (attributes?.length) {
            query.attributes = attributes;
        }
        return new Promise((resolve) => {
            CategoryModel.findAll(query)
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.CATEGORY }));
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
 * @method UpdateCategory: To update existing category
 * @param {Object} detail category detail
 */
export const UpdateCategory = (detail) => {
    try {
        const { data, cond } = detail;

        return new Promise(async (resolve) => {
            if (data.name) {
                const response = await CategoryModel.findOne({
                    where: { [Op.and]: [{ name: data.name.trim() }, { id: { [Op.ne]: cond.id } }] }
                });
                if (response?.name) {
                    resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.CATEGORY }));
                    return;
                }
            }

            CategoryModel.update(data, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.CATEGORY }));
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
 * @method DeleteCategory: To delete existing category
 * @param {Object} cond category detail
 */
export const DeleteCategory = (cond) => {
    try {
        return new Promise((resolve) => {
            CategoryModel.destroy({ where: cond })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.CATEGORY }));
                    }
                })
                .catch((error) => {
                    let errMessage = error.message;
                    if (error.parent?.errno === 1451) {
                        errMessage = "You can't perform this action, because you have selected this category in products.";
                    }
                    resolve(errMessage);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};
