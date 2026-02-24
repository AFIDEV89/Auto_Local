"use strict";
import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const WebSettingModel = db.webSettings;

/**
 * @method CreateWebSetting: To set website settings
 * @param {Object} data setting details
 */
export const CreateWebSetting = (data) => {
  try {
    return new Promise(async (resolve) => {
      WebSettingModel.create(data)
        .then((result) => {
          if (result?.id) {
            resolve(result);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.WEB_SETTING }));
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
 * @method GetWebSetting: To fetch website settings
 */
export const GetWebSetting = () => {
  try {
    return new Promise((resolve) => {
      WebSettingModel.findOne()
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.WEB_SETTING }));
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
 * @method UpdateWebSetting: To update website settings
 * @param {Object} detail setting details
 */
export const UpdateWebSetting = (detail) => {
  try {
    const { data, cond } = detail;
    return new Promise(async (resolve) => {
      WebSettingModel.update(data, { where: cond })
        .then((result) => {
          if (!!result?.[0]) {
            resolve(true);
          } else {
            resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.WEB_SETTING }));
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
