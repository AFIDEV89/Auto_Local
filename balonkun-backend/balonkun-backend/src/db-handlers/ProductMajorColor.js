"use strict";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/Index.js";
import db from "../database/Index.js";
import * as Utils from "../utils/Index.js";

const ProductMajorColorModel = db.productMajorColors;

/**
 * @method CreateProductMajorColor: To add product color
 * @param {Object} data product major color detail
 */
export const CreateProductMajorColor = (list) => {
  try {
    return new Promise(async (resolve) => {
      ProductMajorColorModel.bulkCreate(list)
        .then((result) => {
          if (Utils.isArray(result)) {
            resolve(result);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.PRODUCT_MAJOR_COLOR }));
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
 * @method UpdateProductMajorColor: To update product major color
 * @param {Object} detail product major color detail
 */
export const UpdateProductMajorColor = (detail) => {
  try {
    const { data, cond } = detail;
    return new Promise((resolve) => {
      ProductMajorColorModel.destroy({ where: cond })
        .then(async result => {
          // if (result > 0) {
            resolve(await CreateProductMajorColor(data));
          // } else {
          //   resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.PRODUCT_MAJOR_COLOR }));
          // }
        }).catch((error) => {
          resolve(error.message);
        });
    });
  } catch (error) {
    return error.message || error;
  }
};
