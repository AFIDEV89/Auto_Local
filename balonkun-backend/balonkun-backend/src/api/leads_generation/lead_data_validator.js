import {validations} from "../../common/joi.js";

export const create_lead_validator = {
    customer_name: validations.optional_allow_null_string,
    contact_no: validations.positive_integer,
    product_id: validations.optional_allow_null_positive_integer,
    feedback: validations.optional_allow_null_string,
    status: validations.optional_allow_null_string
};

export const get_lead_validator = {
    id: validations.positive_integer,
};

export const update_lead_validator = {
    id: validations.positive_integer,
    ...create_lead_validator,
};
