import * as dao from "../../database/dao/index.js";
import {model_values} from "../../constants/index.js";
import * as constants from "../../constants/index.js";
import messages from "../../common/messages/content.js";
import * as validations from '../../common/joi.js';
import {
    create_user_address_validator, get_user_address_validator,
    update_user_address_validator
} from "./user_addresses_validator.js";

export function create_user_address(req, res) {
    return validations.validateSchema(
        req,
        res,
        create_user_address_validator,
        () => {
            req.body['user_id'] = req.user.id
            return dao.createRow(model_values.user_address.tableName, req.body)
        },
        constants.CREATION_SUCCESS,
        messages.user_address.create
    );
}


export function get_user_address(req, res) {
    let id = req.user.id
    return validations.validateSchema(
        req,
        res,
        null,
        () => dao.getRows({
            tableName: model_values.user_address.tableName,
            query: {user_id: id},
            attributes: { exclude: ['user_id'] }
        }),
        constants.GET_SUCCESS,
        messages.user_address.get_list
    );
}

export function update_user_address(req, res) {
    return validations.validateSchema(
        req,
        res,
        update_user_address_validator,
        async () => {
            return await dao.updateRow(model_values.user_address.tableName, {id: req.params.id}, req.body);
        },
        constants.UPDATE_SUCCESS,
        messages.blogs_author.update
    );
}

export async function delete_user_address(req, res) {
    //TODO check that address belongs to that user only

    let address = await dao.getRow(model_values.user_address.tableName, {id: req.params.id})
    if (address.user_id === req.user.id) {
        return validations.validateSchema(
            req,
            res,
            get_user_address_validator,
            async () => {
                req.body.user_id = null;
                return await dao.updateRow(model_values.user_address.tableName, {id: req.params.id}, req.body);
            },
            constants.UPDATE_SUCCESS,
            messages.blogs_author.update
        );
    }else {
        return res.json({
            statusCode: constants.FAILURE,
            message: "Address Id not belongs to this user",
        });
    }
}
