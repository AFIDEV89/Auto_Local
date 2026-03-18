"use strict";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/index.js';
import * as dao from "../../database/dao/index.js";
import * as Validator from './VehicleCategoryValidations.js';

/**
 * @method createVehicleCategory: To add new vehicle category
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createVehicleCategory(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.createVehicleCategory,
        () => dao.createRow(constants.model_values.vehicle_category.tableName, req.body),
        constants.CREATION_SUCCESS,
        messages.vehicle_categories.create
    );
};

/**
 * @method getVehicleCategoryList: To get vehicle category list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getVehicleCategoryList(req, res) {
    return validations.validateSchema(
        req,
        res,
        validations.validations.optional_pagination,
        () => dao.getRows({
            tableName: constants.model_values.vehicle_category.tableName,
            ...req.query,
            order : [['name', 'ASC']]
        }),
        constants.GET_SUCCESS,
        messages.vehicle_categories.get_list
    );
};

/**
 * @method updateVehicleCategory: To update existing vehicle category
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateVehicleCategory(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.updateVehicleCategory,
        async () => {
            await dao.updateRow(constants.model_values.vehicle_category.tableName, { id: req.body.id }, req.body);
            return {};
        },
        constants.UPDATE_SUCCESS,
        messages.vehicle_categories.update
    );
};

/**
 * @method deleteVehicleCategory: To delete existing vehicle category
 * @param {Object} req request object
 * @param {Object} res response object
 */
function deleteVehicleCategory(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.deleteVehicleCategory,
        () => dao.deleteRow(constants.model_values.vehicle_category.tableName, { id: req.params.id }),
        constants.DELETE_SUCCESS,
        messages.vehicle_categories.delete
    );
};

export { createVehicleCategory, updateVehicleCategory, getVehicleCategoryList, deleteVehicleCategory };
