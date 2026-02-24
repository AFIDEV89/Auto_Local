"use strict";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/Index.js";
import db from "../database/Index.js";
import * as Utils from "../utils/Index.js";

const ProductMaterialModel = db.productMaterials;

/**
 * @method CreateProductMaterial: To add product material
 * @param {Object} data product material detail
 */
export const CreateProductMaterial = (list) => {
  try {
    return new Promise(async (resolve) => {
      ProductMaterialModel.bulkCreate(list)
        .then((result) => {
          if (Utils.isArray(result)) {
            resolve(result);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.PRODUCT_MATERIAL }));
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
 * @method UpdateProductMaterial: To update product material
 * @param {Object} detail product material detail
 */
export const UpdateProductMaterial = (detail) => {
  try {
    const { data, cond } = detail;
    return new Promise((resolve) => {
      ProductMaterialModel.destroy({ where: cond })
        .then(async result => {
          // if (result > 0) {
            resolve(await CreateProductMaterial(data));
          // } else {
          //   resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.PRODUCT_MATERIAL }));
          // }
        }).catch((error) => {
          resolve(error.message);
        });
    });
  } catch (error) {
    return error.message || error;
  }
};
