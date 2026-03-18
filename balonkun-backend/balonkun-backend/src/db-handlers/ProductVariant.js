"use strict";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const ProductVariantModel = db.productVariants;
const ProductVariantMinorColorModel = db.productVariantMinorColors;

/**
 * @method CreateProductVariant: To add product variant
 * @param {Object} data product variant detail
 */
export const CreateProductVariant = (data) => {
  try {
    return new Promise(async (resolve) => {
      ProductVariantModel.create(data)
        .then((result) => {
          if (result?.id) {
            resolve(result);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.PRODUCT_VARIANT }));
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
 * @method UpdateProductVariant: To update product variant
 * @param {Object} detail product variant detail
 */
export const UpdateProductVariant = (detail) => {
  try {
    const { data, cond } = detail;
    return new Promise((resolve) => {
      ProductVariantModel.destroy({ where: cond })
        .then(async result => {
          // if (result > 0) {
          resolve(await CreateProductVariant(data));
          // } else {
          //   resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.PRODUCT_VARIANT }));
          // }
        }).catch((error) => {
          resolve(error.message);
        });
    });
  } catch (error) {
    return error.message || error;
  }
};

/**
 * @method CreateProductVariantMinorColors: To add product variant minor colors
 * @param {Object} data product variant minor colors detail
 */
export const CreateProductVariantMinorColors = (list) => {
  try {
    return new Promise(async (resolve) => {
      ProductVariantMinorColorModel.bulkCreate(list)
        .then((result) => {
          if (Utils.isArray(result)) {
            resolve(result);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.PRODUCT_VARIANT }));
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
