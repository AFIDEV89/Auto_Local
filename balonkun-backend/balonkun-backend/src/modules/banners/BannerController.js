"use strict";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/index.js';
import * as dao from "../../database/dao/index.js";
import * as bannerDao from "../../database/dao/bannerDao.js";
import * as Validator from './BannerValidations.js';

/**
 * @method createBanner: To add new banner
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createBanner(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.createBanner,
        () => dao.createRow(constants.model_values.banner.tableName, req.body),
        constants.CREATION_SUCCESS,
        messages.banners.create
    );
};

/**
 * @method getList: To get banner list for admin panel
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getList(req, res) {
    return validations.validateSchema(
        req,
        res,
        validations.validations.optional_pagination,
        () => dao.getRows({
            tableName: constants.model_values.banner.tableName,
            ...req.query,
        }),
        constants.GET_SUCCESS,
        messages.banners.get_list
    );
};

/**
 * @method getWebsiteBannerList: To get banner list for user app
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getWebsiteBannerList(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        async () => {
            const settings = await dao.getRow(constants.model_values.web_setting.tableName);
            return bannerDao.getWebsiteBannerList(settings.banners_limit);
        },
        constants.GET_SUCCESS,
        messages.banners.get_list
    );
};

/**
 * @method updateBanner: To update existing banner
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateBanner(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.updateBanner,
        async () => {
            await dao.updateRow(constants.model_values.banner.tableName, { id: req.body.id }, req.body);
            return {};
        },
        constants.UPDATE_SUCCESS,
        messages.banners.update
    );
};

/**
 * @method deleteBanner: To delete existing banner
 * @param {Object} req request object
 * @param {Object} res response object
 */
function deleteBanner(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.deleteBanner,
        () => dao.deleteRow(constants.model_values.banner.tableName, { id: req.params.id }),
        constants.DELETE_SUCCESS,
        messages.banners.delete
    );
};

export { createBanner, updateBanner, getList, deleteBanner, getWebsiteBannerList };
