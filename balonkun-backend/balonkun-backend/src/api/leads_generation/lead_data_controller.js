import * as dao from "../../database/dao/index.js";
import {model_values} from "../../constants/index.js";
import * as constants from "../../constants/index.js";
import messages from "../../common/messages/content.js";
import * as validations from '../../common/joi.js';
import {create_lead_validator, get_lead_validator, update_lead_validator} from "./lead_data_validator.js";
import db from "../../database/index.js";

export function create_lead(req, res) {
    return validations.validateSchema(
        req,
        res,
        create_lead_validator,
        () => {
            return dao.createRow(model_values.leads.tableName, req.body)
        },
        constants.CREATION_SUCCESS,
        messages.leads.create
    );
}


export function get_lead(req, res) {
    const { page, limit, search } = req.query;
    
    const query = {};
    if (search) {
        query[db.Op.or] = [
            { customer_name: { [db.Op.like]: `%${search}%` } },
            { contact_no: { [db.Op.like]: `%${search}%` } }
        ];
    }

    return validations.validateSchema(
        req,
        res,
        null,
        () => dao.getRows({
            tableName: model_values.leads.tableName,
            page,
            limit,
            query
        }),
        constants.GET_SUCCESS,
        messages.leads.get_list
    );
}

export function get_single_lead(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        () => dao.getRow(model_values.leads.tableName, { id: req.params.id }),
        constants.GET_SUCCESS,
        messages.leads.get_id
    );
}

export function update_lead(req, res) {
    return validations.validateSchema(
        req,
        res,
        update_lead_validator,
        async () => {
            return await dao.updateRow(model_values.leads.tableName, {id: req.params.id}, req.body);
        },
        constants.UPDATE_SUCCESS,
        messages.leads.update
    );
}


