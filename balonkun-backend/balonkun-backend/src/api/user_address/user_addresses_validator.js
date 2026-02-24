import {validations} from "../../common/joi.js";

export const create_user_address_validator = {
    street_address: validations.string,
    city: validations.string,
    state: validations.string,
    postal_code: validations.postal_code,
    country: validations.string



}

export const get_user_address_validator = {
    id: validations.positive_integer,
};

export const update_user_address_validator = {
    id: validations.positive_integer,
    ...create_user_address_validator,
};
