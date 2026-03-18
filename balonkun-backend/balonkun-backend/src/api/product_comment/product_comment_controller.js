import * as dao from "../../database/dao/index.js";
import {model_values} from "../../constants/index.js";
import * as constants from "../../constants/index.js";
import messages from "../../common/messages/content.js";
import {createProductComments, getProductComments} from "./product_comment_validator.js";
import * as validations from '../../common/joi.js';

export function get_product_comments(req, res) {
    console.log("product comments")
    return validations.validateSchema(
        req,
        res,
        getProductComments,
        () => dao.getRows({tableName:model_values.product_comments.tableName,  query :{product_id: req.params.id}}),
        constants.GET_SUCCESS,
        messages.blogs_author.get
    );
}



export function create_product_comments(req, res) {
    console.log("create product comments")
    return validations.validateSchema(
        req,
        res,
        createProductComments,
        () => dao.createRow(model_values.product_comments.tableName, req.body),
        constants.CREATION_SUCCESS,
        messages.blogs_author.create
    );
}