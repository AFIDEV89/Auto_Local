"use strict";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/index.js';
import * as dao from "../../database/dao/index.js";
import * as Validator from './BlogCategoryValidations.js';

/**
 * @method createBlogCategory: To add new blog category
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createBlogCategory(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.createBlogCategory,
    () => dao.createRow(constants.model_values.blog_category.tableName, req.body),
    constants.CREATION_SUCCESS,
    messages.blog_categories.create
  );
};

/**
 * @method getBlogCategoryList: To get list of added blog categories
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getBlogCategoryList(req, res) {
  return validations.validateSchema(
    req,
    res,
    validations.validations.optional_pagination,
    () => dao.getRows({ tableName: constants.model_values.blog_category.tableName, ...req.query }),
    constants.GET_SUCCESS,
    messages.blog_categories.get_list
  );
};

/**
 * @method updateBlogCategory: To update existing blog category
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateBlogCategory(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.updateBlogCategory,
    async () => {
      await dao.updateRow(constants.model_values.blog_category.tableName, { id: req.body.id }, req.body);
      return {};
    },
    constants.UPDATE_SUCCESS,
    messages.blog_categories.update
  );
};

/**
 * @method deleteBlogCategory: To delete existing blog category
 * @param {Object} req request object
 * @param {Object} res response object
 */
function deleteBlogCategory(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.deleteBlogCategory,
    () => dao.deleteRow(constants.model_values.blog_category.tableName, req.params),
    constants.DELETE_SUCCESS,
    messages.blog_categories.delete
  );
};

export { createBlogCategory, getBlogCategoryList, updateBlogCategory, deleteBlogCategory };
