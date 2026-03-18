"use strict";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/responses.js';
import * as dao from "../../database/dao/index.js";
import * as Validator from './BlogValidations.js';
import db from '../../database/index.js';
import {model_values} from "../../constants/index.js";
import Sequelize, {Op} from 'sequelize';

/**
 * @method createBlog: To add new blog
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createBlog(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.createBlog,
        () => dao.createRow('blogs', req.body),
        constants.CREATION_SUCCESS,
        messages.blogs.create
    );
};

/**
 * @method getList: To get list of added blogs
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getList(req, res) {
    let query = {};
    query["blog_category_id"] = req.query.id;
    let page = req.query.page;
    let limit = req.query.limit;
    console.log(query)
    return validations.validateSchema(
        req,
        res,
        validations.validations.pagination_id,
        () => dao.getRows({
            tableName: 'blogs',
            query,
            page,
            limit,
            include: [{model: db.blogCategories}, {model: db.blogAuthors}]
        }),
        constants.GET_SUCCESS,
        messages.blogs.get_list
    );
};

function getPopularBlogs(req, res) {
    const query = {}
    query["is_popular"] = true
    return validations.validateSchema(
        req,
        res,
        validations.validations.optional_pagination,
        () => dao.getRows({
            tableName: 'blogs',
            query,
            include: [{model: db.blogCategories}, {model: db.blogAuthors}]
        }),
        constants.GET_SUCCESS,
        messages.blogs.get_list
    );
}

/**
 * @method updateBlog: To update existing blog
 * @param {Object} req request object
 * @param {Object} res response object
 */
function updateBlog(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.updateBlog,
        async () => {
            await dao.updateRow('blogs', {id: req.params.id}, req.body);
            return {};
        },
        constants.UPDATE_SUCCESS,
        messages.blogs.update
    );
};

/**
 * @method deleteBlog: To delete existing blog
 * @param {Object} req request object
 * @param {Object} res response object
 */
function deleteBlog(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.deleteBlog,
        () => dao.deleteRow('blogs', {id: req.params.id}),
        constants.DELETE_SUCCESS,
        messages.blogs.delete
    );
};

/**
 * @method getBlog: To get blog
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getBlog(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.getBlog,
        () => getBlogFromID(req.params.id),
        constants.GET_SUCCESS,
        messages.blogs.get
    );
}

async function getBlogFromID(id) {
    // First, fetch the current blog post
    const currentBlog = await dao.getRow('blogs', {id: id}, [{model: db.blogCategories}, {model: db.blogAuthors}]);

// Now, find the previous and next blog posts within the same category
    const currentCategoryId = currentBlog.blog_category.id;
    const currentBlogId = parseInt(id);
// Find the previous blog
    const previousBlog = await dao.getRows( {tableName:'blogs',
        query: {
            id: {
                [Sequelize.Op.lt]: currentBlogId  // Get blogs with id less than current id
            },
            blog_category_id: currentCategoryId
        },
        attributes: ['id', 'title'], // Only fetch id and name
        order: [['id', 'DESC']],
        // Order by id descending to get the previous blog
        limit: 1 // Only fetch one blog
    });

// Find the next blog
    const nextBlog = await dao.getRows( {tableName:'blogs',
        query: {
            id: {
                [Sequelize.Op.gt]: currentBlogId  // Get blogs with id less than current id
            },
            blog_category_id: currentCategoryId
        },
        attributes: ['id', 'title'], // Only fetch id and name
        order: [['id', 'DESC']], // Order by id descending to get the previous blog
        limit: 1 // Only fetch one blog
    });

    currentBlog.setDataValue("previousBlog", previousBlog[0]?previousBlog[0]:null)
    currentBlog.setDataValue("nextBlog", nextBlog[0]?nextBlog[0]:null)
    // currentBlog.nextBlog = nextBlog[0]?nextBlog[0]:null

    return currentBlog;

// Now, you have currentBlog, previousBlog, and nextBlog

}

/**
 * @method getDashboardList: To get list of added blogs for dashboard
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getDashboardList(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        () => dao.getRows(
            {
                tableName: model_values.blog_category.tableName,
                attributes: {exclude: ['content']},
                include: [{model: db.blogs, include: {model: db.blogAuthors}}]
            }),
        constants.GET_SUCCESS,
        messages.blogs.get_list
    );
};

function updateBlogHeader(req, res) {
    return validations.validateSchema(
        req,
        res,
        Validator.getBlog,
        async () => {
            await dao.updateRow('blogs', {id: {[Op.ne]: req.params.id}}, {is_header: false})
            await dao.updateRow('blogs', {id: req.params.id}, {is_header: true})
            return {}
        },
        constants.GET_SUCCESS,
        messages.blogs.update_header
    );
}

function getOldDashboardList(req, res) {
    let page = req.query.page;
    let limit = req.query.limit;
    return validations.validateSchema(
        req,
        res,
        null,
        () => dao.getRows({tableName: 'blogs', include: [{model: db.blogCategories}], page: page, limit: limit}),
        constants.GET_SUCCESS,
        messages.blogs.get_list
    );
};

function getHeaderBlog(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        () => dao.getRow('blogs', {is_header: true}, [{model: db.blogCategories}, {model: db.blogAuthors}]),
        constants.GET_SUCCESS,
        messages.blogs.get
    );
};
export {
    createBlog,
    getList,
    updateBlog,
    deleteBlog,
    getBlog,
    getDashboardList,
    getPopularBlogs,
    updateBlogHeader,
    getOldDashboardList,
    getHeaderBlog
};
