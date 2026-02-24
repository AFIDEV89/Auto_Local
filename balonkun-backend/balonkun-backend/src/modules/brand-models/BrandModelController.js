"use strict";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/index.js';
import * as dao from "../../database/dao/index.js";
import db from '../../database/index.js';
import * as Validator from './BrandModelValidations.js';

/**
 * @method createBrandModel: To add new brand model
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createBrandModel(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.createBrandModel,
    () => dao.createRow(constants.model_values.brand_model.tableName, req.body),
    constants.CREATION_SUCCESS,
    messages.brand_models.create
  );
};

/**
 * @method getBrandModelList: To get brand model list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getBrandModelList(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.getBrandModelList,
    () => {
      const query = {};
      if (req.query.brand_id) query.brand_id = req.query.brand_id;
      if (req.query.vehicle_type_id) query.vehicle_type_id = req.query.vehicle_type_id;
      return dao.getRows({
        tableName: constants.model_values.brand_model.tableName,
        query,
        ...req.query,
        include: [
          {
            model: db[constants.model_values.brand.tableName],
            attributes: ['id', 'name'],
          },
          {
            model: db[constants.model_values.vehicle_type.tableName],
            attributes: ['id', 'name'],
          }
        ],
          order : [['name', 'ASC']]
      });
    },
    constants.GET_SUCCESS,
    messages.brand_models.get_list
  );
};

/**
 * @method updateBrandModel: To update existing brand model
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateBrandModel(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.updateBrandModel,
    async () => {
      await dao.updateRow(constants.model_values.brand_model.tableName, { id: req.body.id }, req.body);
      return {};
    },
    constants.UPDATE_SUCCESS,
    messages.brand_models.update
  );
};

/**
 * @method deleteBrandModel: To delete existing brand model
 * @param {Object} req request object
 * @param {Object} res response object
 */
function deleteBrandModel(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.deleteBrandModel,
    () => dao.deleteRow(constants.model_values.brand_model.tableName, { id: req.params.id }),
    constants.DELETE_SUCCESS,
    messages.brand_models.delete
  );
};

export { createBrandModel, getBrandModelList, updateBrandModel, deleteBrandModel };
