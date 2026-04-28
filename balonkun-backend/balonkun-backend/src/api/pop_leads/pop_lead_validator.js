import Joi from 'joi';
import {validations} from "../../common/joi.js";

export const create_pop_lead_validator = Joi.object({
    customer_name: validations.string,
    email: Joi.string().trim().email().allow(null, ''),
    contact_no: Joi.string().trim().pattern(/^[6-9]\d{9}$/).allow(null, ''),
    feedback: validations.optional_allow_null_string,
    status: validations.optional_allow_null_string
}).or('email', 'contact_no');

export const update_pop_lead_validator = create_pop_lead_validator.keys({
    id: validations.positive_integer,
});
