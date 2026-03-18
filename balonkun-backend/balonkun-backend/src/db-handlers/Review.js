"use strict";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const ReviewModel = db.review;



/**
 * @method GetReviewsById: To fetch Reviews based on product id
 */
export const GetReviewsById = ({ product_id }) => {
    try {
        return new Promise((resolve) => {
            ReviewModel.findAll({
                where: { product_id }
            })
                .then((result) => {
                    if (result && result.length > 0) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.GET_REVIEWS_BY_PRODUCT_ID }));
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
 * @method CreateReview: To add new review
 * @param {Object} data review detail
 */
export const CreateReview = (data) => {
    try {
        return new Promise(async (resolve) => {

            ReviewModel.create(data)
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.REVIEW }));
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
 * @method GetReviewList: To fetch Reviews
 */
export const GetReviewList = () => {
    try {
        return new Promise((resolve) => {
            ReviewModel.findAll()
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.REVIEW }));
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
 * @method UpdateReview: To update existing review
 * @param {Object} detail review detail
 */
export const UpdateReview = (detail) => {
    try {
        const { data, cond } = detail;
        return new Promise(async (resolve) => {
            ReviewModel.update(data, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.REVIEW }));
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
 * @method DeleteReview: To delete existing review
 * @param {Object} cond review detail
 */
export const DeleteReview = (cond) => {
    try {
        return new Promise((resolve) => {
            ReviewModel.destroy({ where: cond })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.REVIEW }));
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
