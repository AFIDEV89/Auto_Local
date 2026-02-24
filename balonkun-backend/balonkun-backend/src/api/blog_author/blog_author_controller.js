import * as dao from "../../database/dao/index.js";
import * as constants from "../../constants/index.js";
import messages from "../../common/messages/content.js";
import {createBlogAuthor, getBlogAuthor, updateBlogAuthor} from "./blog_author_validator.js";
import * as validations from '../../common/joi.js';
import {model_values} from "../../constants/index.js";

export function get_blog_author(req, res) {
    console.log("get_Blog_Author")
    return validations.validateSchema(
        req,
        res,
        getBlogAuthor,
         () => dao.getRow(model_values.blog_authors.tableName, {id: req.params.id}),
        constants.GET_SUCCESS,
        messages.blogs_author.get
    );
}

export function get_blog_author_list(req, res) {
    console.log("get_blog_author_list")
    let page = req.query.page;
    let limit =req.query.limit;
    return validations.validateSchema(
        req,
        res,
        validations.validations.optional_pagination,
        () => dao.getRows({
            tableName: model_values.blog_authors.tableName,
            page,
            limit,
        }),
        constants.GET_SUCCESS,
        messages.blogs_author.get_list
    );
};
export function update_blog_author(req, res) {
    return validations.validateSchema(
        req,
        res,
        updateBlogAuthor,
        async () => {
            await dao.updateRow(model_values.blog_authors.tableName, {id: req.params.id}, req.body);
            return {};
        },
        constants.UPDATE_SUCCESS,
        messages.blogs_author.update
    );
}
export function create_blog_author(req, res) {
    return validations.validateSchema(
        req,
        res,
        createBlogAuthor,
        () => dao.createRow(model_values.blog_authors.tableName, req.body),
        constants.CREATION_SUCCESS,
        messages.blogs_author.create
    );
}