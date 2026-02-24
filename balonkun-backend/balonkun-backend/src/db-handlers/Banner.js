"use strict";
import sequelize from "sequelize";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const BannerModel = db.banners;
const { Op } = sequelize;

/**
 * @method CreateBanner: To add new banner
 * @param {Object} data banner detail
 */
export const CreateBanner = (data) => {
    try {

        return new Promise(async (resolve) => {
            const response = await BannerModel.findOne({
                where: { title: data.title }
            });
            if (response && response.title) {
                resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.BANNER }));
                return;
            }
            BannerModel.create(data)
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.BANNER }));
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
 * @method GetBannerList: To fetch banners
 */
export const GetBannerList = (limit) => {
    try {
        return new Promise((resolve) => {
            const query = {};
            if (limit) {
                query.limit = limit;
            }
            BannerModel.findAll(query)
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.BANNER }));
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
 * @method UpdateBanner: To update existing banner
 * @param {Object} detail banner detail
 */
export const UpdateBanner = (detail) => {
    try {
        const { data, cond } = detail;
        return new Promise(async (resolve) => {
            if (data.title) {
                const response = await BannerModel.findOne({
                    where: { [Op.and]: [{ title: data.title.trim() }, { id: { [Op.ne]: cond.id } }] }
                });
                if (response?.title) {
                    resolve(Utils.failureError({ type: QUERY_TYPE.EXIST, name: MODULE_TYPE.BANNER }));
                    return;
                }
            }
            BannerModel.update(data, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.BANNER }));
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
 * @method DeleteBanner: To delete existing banner
 * @param {Object} cond banner detail
 */
export const DeleteBanner = (cond) => {
    try {
        return new Promise((resolve) => {
            BannerModel.destroy({ where: cond })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.BANNER }));
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
