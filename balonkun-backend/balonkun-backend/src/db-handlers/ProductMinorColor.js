"use strict";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/Index.js";
import db from "../database/Index.js";
import * as Utils from "../utils/Index.js";

const ProductMinorColorModel = db.productMinorColors;

/**
 * @method CreateProductMinorColor: To add product color
 * @param {Object} data product minor color detail
 */
export const CreateProductMinorColor = (list) => {
  try {
    return new Promise(async (resolve) => {
      ProductMinorColorModel.bulkCreate(list)
        .then((result) => {
          if (Utils.isArray(result)) {
            resolve(result);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.PRODUCT_MINOR_COLOR }));
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
 * @method UpdateProductMinorColor: To update product minor color
 * @param {Object} detail product minor color detail
 */
export const UpdateProductMinorColor = (detail) => {
  try {
    const { data, cond } = detail;
    return new Promise((resolve) => {
      ProductMinorColorModel.destroy({ where: cond })
        .then(async result => {
          // if (result > 0) {
            resolve(await CreateProductMinorColor(data));
          // } else {
          //   resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.PRODUCT_MINOR_COLOR }));
          // }
        }).catch((error) => {
          resolve(error.message);
        });
    });
  } catch (error) {
    return error.message || error;
  }
};
