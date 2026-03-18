"use strict";
import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const DesignModel = db.designs;

/**
 * @method CreateDesign: To add new design
 * @param {Object} data design detail
 */
export const CreateDesign = (data) => {
  try {
    return new Promise(async (resolve) => {
      DesignModel.create(data)
        .then((result) => {
          if (result?.id) {
            resolve(result);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.DESIGN }));
          }
        })
        .catch((error) => {
          if (error.parent?.sqlState === '23000') {
            resolve('Design already exist.');
          }
          resolve(error.message);
        });
    });
  } catch (error) {
    return error.message || error;
  }
};

/**
 * @method GetDesignList: To fetch designs
 */
export const GetDesignList = (cond, attributes) => {
  try {
    const query = { where: cond || {} };
    if (attributes?.length) {
      query.attributes = attributes;
    }
    return new Promise((resolve) => {
      DesignModel.findAll(query)
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.DESIGN }));
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
 * @method UpdateDesign: To update existing design
 * @param {Object} detail design detail
 */
export const UpdateDesign = (detail) => {
  try {
    const { data, cond } = detail;
    return new Promise(async (resolve) => {
      DesignModel.update(data, { where: cond })
        .then((result) => {
          if (!!result?.[0]) {
            resolve(true);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.DESIGN }));
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
 * @method DeleteDesign: To delete existing design
 * @param {Object} cond design detail
 */
export const DeleteDesign = (cond) => {
  try {
    return new Promise((resolve) => {
      DesignModel.destroy({ where: cond })
        .then((result) => {
          if (result) {
            resolve(true);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.DELETING, name: MODULE_TYPE.DESIGN }));
          }
        })
        .catch((error) => {
          let errMessage = error.message;
          if (error.parent?.errno === 1451) {
            errMessage = "You can't perform this action, because you have selected this design in products.";
          }
          resolve(errMessage);
        });
    });
  } catch (error) {
    return error.message || error;
  }
};
