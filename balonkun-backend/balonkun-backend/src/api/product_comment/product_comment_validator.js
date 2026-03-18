import {validations} from "../../common/joi.js";

export const createProductComments = {
    "product_id":validations.positive_integer,
    comment: validations.string,
    author_pic: validations.string,
    author:validations.string
}

export const getProductComments = {
    id: validations.positive_integer,
};