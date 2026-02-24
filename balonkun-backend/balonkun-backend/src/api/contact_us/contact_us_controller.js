import * as constants from "../../constants/index.js";
import messages from "../../common/messages/content.js";
import {contact_us_fields} from "./contact_us_validator.js";



export function contact_us_save(req, res) {
    console.log("contact_us_save")
    return validations.validateSchema(
        req,
        res,
        contact_us_fields,
        () => {

        },
        constants.GET_SUCCESS,
        messages.blogs_author.get
    );
}