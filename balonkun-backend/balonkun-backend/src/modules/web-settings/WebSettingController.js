"use strict";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/index.js';
import * as dao from "../../database/dao/index.js";
import * as Validator from './WebSettingValidations.js';

/**
 * @method createWebSettings: To set website settings
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createWebSettings(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.createWebSettings,
    () => dao.createRow(constants.model_values.web_setting.tableName, req.body),
    constants.CREATION_SUCCESS,
    messages.web_settings.create
  );
};

/**
 * @method getWebSettings: To get web settings
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getWebSettings(req, res) {
  return validations.validateSchema(
    req,
    res,
    null,
    () => dao.getRow(constants.model_values.web_setting.tableName),
    constants.GET_SUCCESS,
    messages.web_settings.get
  );
};

/**
 * @method UpdateWebSetting: To update web settings
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const UpdateWebSetting = async (req, res) => {
  try {
    const { body } = req;
    const errors = validations.validateSchema({ data: body, schema: validations.UpdateWebSetting });
    if (errors) {
      return res.json({
        statusCode: constants.FAILURE,
        message: constants.BAD_REQUEST,
        errors
      });
    }
    const { banners_limit, dashboard_products_limit } = body;
    const request = {};
    if (banners_limit) {
      request.banners_limit = banners_limit;
    }
    if (dashboard_products_limit) {
      request.dashboard_products_limit = dashboard_products_limit;
    }
    const settings = await DbHandler.UpdateWebSetting({ cond: { id: body.id }, data: request });
    if (settings === true) {
      res.json({
        statusCode: constants.UPDATE_SUCCESS,
        message: 'Web settings updated successfully.'
      });
    } else {
      res.json({
        statusCode: constants.FAILURE,
        message: settings,
      });
    }
  } catch (error) {
    res.json({
      statusCode: constants.SERVER_CRASH,
      message: error.message || error,
    });
  }
};
function updateWebSettings(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.updateWebSettings,
    async () => {
      await dao.updateRow(constants.model_values.web_setting.tableName, { id: req.body.id }, req.body);
      return {};
    },
    constants.UPDATE_SUCCESS,
    messages.web_settings.update
  );
};

export { createWebSettings, getWebSettings, updateWebSettings };
