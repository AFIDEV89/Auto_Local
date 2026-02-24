"use strict";
import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const BrandModel = db.brandModels;
const Brand = db.brands;

/**
 * @method CreateBrandModel: To add new brand model
 * @param {Object} data brand model detail
 */
export const CreateBrandModel = (data) => {
  try {
    return new Promise(async (resolve) => {
      BrandModel.create(data)
        .then((result) => {
          if (result?.id) {
            resolve(result);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.BRAND_MODEL }));
          }
        })
        .catch((error) => {
          if (error.parent?.sqlState === '23000') {
            resolve('Brand model already exist.');
          }
          resolve(error.message);
        });
    });
  } catch (error) {
    return error.message || error;
  }
};

/**
 * @method GetBrandModelList: To fetch brand models
 */
export const GetBrandModelList = (cond, attributes) => {
  try {
    const query = {
      where: cond || {},
      include: [
        { model: Brand }
      ],
    };
    if (attributes?.length) {
      query.attributes = attributes;
    }
    return new Promise((resolve) => {
      BrandModel.findAll(query)
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.BRAND_MODEL }));
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
 * @method UpdateBrandModel: To update existing brand model
 * @param {Object} detail brand model detail
 */
export const UpdateBrandModel = (detail) => {
  try {
    const { data, cond } = detail;
    return new Promise(async (resolve) => {
      BrandModel.update(data, { where: cond })
        .then((result) => {
          if (!!result?.[0]) {
            resolve(true);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.BRAND_MODEL }));
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
 * @method DeleteBrandModel: To delete existing brand model
 * @param {Object} cond brand model detail
 */
export const DeleteBrandModel = (cond) => {
  try {
    return new Promise((resolve) => {
      BrandModel.destroy({ where: cond })
        .then((result) => {
          if (result) {
            resolve(true);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.BRAND_MODEL }));
          }
        })
        .catch((error) => {
          let errMessage = error.message;
          if (error.parent?.errno === 1451) {
            errMessage = "You can't perform this action, because you have selected this brand model in products.";
          }
          resolve(errMessage);
        });
    });
  } catch (error) {
    return error.message || error;
  }
};
