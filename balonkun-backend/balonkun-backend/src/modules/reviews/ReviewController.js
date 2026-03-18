"use strict";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/index.js';
import * as dao from "../../database/dao/index.js";
import * as Validator from './ReviewValidations.js';

/**
 * @method createReview: To add new review
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createReview(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.createReview,
        () => dao.createRow(constants.model_values.review.tableName, req.body),
        constants.CREATION_SUCCESS,
        messages.reviews.create
    );
};

/**
 * @method getReviewList: To get review list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getReviewList(req, res) {
    return validations.validateSchema(
        req,
        res,
        validations.validations.optional_pagination,
        () => dao.getRows({
            tableName: constants.model_values.review.tableName,
            ...req.query,
        }),
        constants.GET_SUCCESS,
        messages.reviews.get_list
    );
};

/**
 * @method updateReview: To update existing review
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateReview(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.updateReview,
        async () => {
            await dao.updateRow(constants.model_values.review.tableName, { id: req.params.id }, req.body);
            return {};
        },
        constants.UPDATE_SUCCESS,
        messages.reviews.update
    );
};

/**
 * @method deleteReview: To delete existing review
 * @param {Object} req request object
 * @param {Object} res response object
 */
function deleteReview(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.deleteReview,
        () => dao.deleteRow(constants.model_values.review.tableName, { id: req.params.id }),
        constants.DELETE_SUCCESS,
        messages.reviews.delete
    );
};


/**
 * @method getReviewsByProductId: To fetch product review list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getReviewsByProductId(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.getReviewsByProductId,
        () => dao.getRows({ tableName: constants.model_values.review.tableName, query: { product_id: req.params.id } }),
        constants.GET_SUCCESS,
        messages.reviews.get_list
    );
};

export { createReview, updateReview, getReviewList, deleteReview, getReviewsByProductId };
