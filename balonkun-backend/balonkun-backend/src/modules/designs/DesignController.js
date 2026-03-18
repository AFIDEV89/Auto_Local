"use strict";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/index.js';
import * as dao from "../../database/dao/index.js";
import * as Validator from './DesignValidations.js';

/**
 * @method createDesign: To add new design
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createDesign(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.createDesign,
    () => dao.createRow(constants.model_values.design.tableName, req.body),
    constants.CREATION_SUCCESS,
    messages.designs.create
  );
};

/**
 * @method getDesignList: To get design list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getDesignList(req, res) {
  return validations.validateSchema(
    req,
    res,
    validations.validations.optional_pagination,
    () => getDesignsList(req.query),
    constants.GET_SUCCESS,
    messages.designs.get_list
  );
};
export function getDesignsList(query) {
    return dao.getRows({
        tableName: constants.model_values.design.tableName,
        ...query,
    })
}
/**
 * @method updateDesign: To update existing design
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateDesign(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.updateDesign,
    async () => {
      await dao.updateRow(constants.model_values.design.tableName, { id: req.body.id }, req.body);
      return {};
    },
    constants.UPDATE_SUCCESS,
    messages.designs.update
  );
};

/**
 * @method deleteDesign: To delete existing design
 * @param {Object} req request object
 * @param {Object} res response object
 */
function deleteDesign(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.deleteDesign,
    () => dao.deleteRow(constants.model_values.design.tableName, { id: req.params.id }),
    constants.DELETE_SUCCESS,
    messages.designs.delete
  );
};

export { createDesign, updateDesign, getDesignList, deleteDesign };
