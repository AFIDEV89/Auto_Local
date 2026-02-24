"use strict";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/index.js';
import * as dao from "../../database/dao/index.js";
import * as Validator from './ColorValidations.js';

/**
 * @method createColor: To add new color
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createColor(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.createColor,
        () => dao.createRow(constants.model_values.color.tableName, req.body),
        constants.CREATION_SUCCESS,
        messages.colors.create
    );
};

/**
 * @method getColorList: To get color list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getColorList(req, res) {
    return validations.validateSchema(
        req,
        res,
        validations.validations.optional_pagination,
        getColorsList(req.query),
        constants.GET_SUCCESS,
        messages.colors.get_list
    );
};

export function getColorsList(query) {
    return () => dao.getRows({
            tableName: constants.model_values.color.tableName,
            ...query,
        })
}

/**
 * @method updateColor: To update existing color
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateColor(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.updateColor,
        async () => {
            await dao.updateRow(constants.model_values.color.tableName, { id: req.params.id }, req.body);
            return {};
        },
        constants.UPDATE_SUCCESS,
        messages.colors.update
    );
};

/**
 * @method deleteColor: To delete existing color
 * @param {Object} req request object
 * @param {Object} res response object
 */
function deleteColor(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.deleteColor,
        () => dao.deleteRow(constants.model_values.color.tableName, { id: req.params.id }),
        constants.DELETE_SUCCESS,
        messages.colors.delete
    );
};

export { createColor, updateColor, getColorList, deleteColor };
