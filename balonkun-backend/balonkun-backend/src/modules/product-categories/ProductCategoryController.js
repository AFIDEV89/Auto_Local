"use strict";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from "../../constants/index.js";
import * as dao from "../../database/dao/index.js";
import * as Validator from './ProductCategoryValidations.js';





/**
 * @method createProductCategory: To add new category
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createProductCategory(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.createProductCategory,
        () => dao.createRow(constants.model_values.product_category.tableName, req.body),
        constants.CREATION_SUCCESS,
        messages.product_categories.create
    );
};

/**
 * @method getAdminProductCategoryList: To get categories list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getAdminProductCategoryList(req, res) {
    return validations.validateSchema(
        req,
        res,
        validations.validations.optional_pagination,
        () => dao.getRows({
            tableName: constants.model_values.product_category.tableName,
            ...req.query
        }),
        constants.GET_SUCCESS,
        messages.product_categories.get_list
    );
};

/**
 * @method updateProductCategory: To update existing category
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateProductCategory(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.updateProductCategory,
        async () => {
            await dao.updateRow(constants.model_values.product_category.tableName, { id: req.params.id }, req.body);
            return {};
        },
        constants.UPDATE_SUCCESS,
        messages.product_categories.update
    );
};

/**
 * @method deleteProductCategory: To delete existing category
 * @param {Object} req request object
 * @param {Object} res response object
 */
function deleteProductCategory(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.deleteProductCategory,
        () => dao.deleteRow(constants.model_values.product_category.tableName, { id: req.params.id }),
        constants.DELETE_SUCCESS,
        messages.product_categories.delete
    );
}

/**
 * @method getUserProductCategoryList: To get categories list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getUserProductCategoryList(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        () => dao.getRows({
            tableName: constants.model_values.product_category.tableName,
        }),
        constants.GET_SUCCESS,
        messages.product_categories.get_list
    );
}



export { createProductCategory, updateProductCategory, getAdminProductCategoryList, deleteProductCategory, getUserProductCategoryList };
