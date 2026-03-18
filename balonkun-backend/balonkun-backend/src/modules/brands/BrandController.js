"use strict";
import sequelize from "sequelize";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/index.js';
import * as dao from "../../database/dao/index.js";
import db from "../../database/index.js";
import * as Validator from './BrandValidations.js';

const { Op } = sequelize;

/**
 * @method createBrand: To add new brand
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createBrand(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.createBrand,
    () => dao.createRow(constants.model_values.brand.tableName, req.body),
    constants.CREATION_SUCCESS,
    messages.brands.create
  );
};

/**
 * @method getBrandList: To get brand list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getBrandList(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.getBrandList,
    () => {
      const query = {};
      if (req.query.vehicle_type_id) query.vehicle_type_id = { [Op.in]: [0, req.query.vehicle_type_id] };
      return dao.getRows({
        tableName: constants.model_values.brand.tableName,
        query,
        ...req.query,
          order : [['name', 'ASC']],
        include: [
          {
            model: db[constants.model_values.vehicle_type.tableName],
            attributes: ['id', 'name'],
          }
        ]
      });
    },
    constants.GET_SUCCESS,
    messages.brands.get_list
  );
};

/**
 * @method updateBrand: To update existing brand
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateBrand(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.updateBrand,
    async () => {
      await dao.updateRow(constants.model_values.brand.tableName, { id: req.body.id }, req.body);
      return {};
    },
    constants.UPDATE_SUCCESS,
    messages.brands.update
  );
};

/**
 * @method deleteBrand: To delete existing brand
 * @param {Object} req request object
 * @param {Object} res response object
 */
function deleteBrand(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.deleteBrand,
    () => dao.deleteRow(constants.model_values.brand.tableName, { id: req.params.id }),
    constants.DELETE_SUCCESS,
    messages.brands.delete
  );
};

export { createBrand, updateBrand, getBrandList, deleteBrand };
