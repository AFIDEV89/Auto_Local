import {validations} from "../../common/joi.js";

export const contact_us_fields = {
    name:validations.string,
    email: validations.email,
    message: validations.string,
}

