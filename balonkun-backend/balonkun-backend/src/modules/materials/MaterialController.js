"use strict";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/index.js';
import * as dao from "../../database/dao/index.js";
import * as Validator from './MaterialValidations.js';

/**
 * @method createMaterial: To add new material
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createMaterial(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.createMaterial,
        () => dao.createRow(constants.model_values.material.tableName, req.body),
        constants.CREATION_SUCCESS,
        messages.materials.create
    );
};

/**
 * @method getMaterialList: To get material list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getMaterialList(req, res) {
    return validations.validateSchema(
        req,
        res,
        validations.validations.optional_pagination,
        () => getMaterialsList(req.query),
        constants.GET_SUCCESS,
        messages.materials.get_list
    );
};

export function getMaterialsList(query) {
    return dao.getRows({
        tableName: constants.model_values.material.tableName,
        ...query,
    })
}

/**
 * @method updateMaterial: To update existing material
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateMaterial(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.updateMaterial,
        async () => {
            await dao.updateRow(constants.model_values.material.tableName, { id: req.params.id }, req.body);
            return {};
        },
        constants.UPDATE_SUCCESS,
        messages.materials.update
    );
};

/**
 * @method deleteMaterial: To delete existing material
 * @param {Object} req request object
 * @param {Object} res response object
 */
function deleteMaterial(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.deleteMaterial,
        () => dao.deleteRow(constants.model_values.material.tableName, { id: req.params.id }),
        constants.DELETE_SUCCESS,
        messages.materials.delete
    );
};

export { createMaterial, updateMaterial, getMaterialList, deleteMaterial };
