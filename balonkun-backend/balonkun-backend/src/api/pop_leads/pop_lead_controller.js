import * as dao from "../../database/dao/index.js";
import {model_values} from "../../constants/index.js";
import * as constants from "../../constants/index.js";
import messages from "../../common/messages/content.js";
import * as validations from '../../common/joi.js';
import {create_pop_lead_validator, update_pop_lead_validator} from "./pop_lead_validator.js";

export function create_pop_lead(req, res) {
    return validations.validateSchema(
        req,
        res,
        create_pop_lead_validator,
        () => {
            return dao.createRow("popLeads", req.body)
        },
        constants.CREATION_SUCCESS,
        messages.leads.create
    );
}

export function get_pop_leads(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        () => dao.getRows({
            tableName: "popLeads",
            page: req.query.page,
            limit: req.query.limit
        }),
        constants.GET_SUCCESS,
        messages.leads.get_list
    );
}

export function update_pop_lead(req, res) {
    return validations.validateSchema(
        req,
        res,
        update_pop_lead_validator,
        async () => {
            return await dao.updateRow("popLeads", {id: req.params.id}, req.body);
        },
        constants.UPDATE_SUCCESS,
        messages.leads.update
    );
}

export function delete_pop_lead(req, res) {
    return validations.validateSchema(
        req,
        res,
        null,
        async () => {
            return await dao.deleteRow("popLeads", {id: req.params.id});
        },
        constants.UPDATE_SUCCESS,
        "Pop Lead deleted successfully"
    );
}
