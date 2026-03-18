"use strict";
import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const ProductModel = db.products;

/**
 * @method GetDashboardProductList: To get dashboard product list
 * @param {Object} data product filters
 */
export const GetDashboardProductList = (data) => {
  try {
    const { cond = {}, limit } = data;
    return new Promise((resolve) => {
      ProductModel.findAll({
        where: cond,
        order: [['updatedAt', 'DESC']],
        offset: 0,
        limit,
      })
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.PRODUCT }));
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
