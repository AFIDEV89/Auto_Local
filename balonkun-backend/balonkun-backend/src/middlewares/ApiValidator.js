"use strict";
import * as constants from "../constants/index.js";
import * as Utils from "../utils/index.js";

const fieldsGenerator = (list) => {
    return list.map((key) => ({
        name: Utils.titleCase(key.replace(/_/g, " ")),
        key,
    }));
};

export const ApiValidator = (req, res, next) => {
    try {
        const { originalUrl, body, query } = req;
        const id = Utils.getId(originalUrl);
        const payload = { ...body, ...query, id: Number.isInteger(parseInt(id)) ? id : "" };
        const apiUrl = Utils.paramRemover(originalUrl);
        let errors = [];
        const fields = fieldsGenerator(
            constants.Routes.find((route) => {
                if (route.path.includes("/:id")) {
                    return apiUrl.includes(route.path.split("/:id")[0]);
                } else {
                    return route.path === apiUrl;
                }
            })?.fields || []
        );
        for (let field of fields) {
            const { name, key } = field;
            const value = (payload && payload[key]) || "";

            if (!value || ["", null, undefined].includes(value)) {
                errors.push(`${name} is required.`);
            } else if (key.toLowerCase().includes("id") && value < 1) {
                errors.push(`${name} is invalid.`);
            } else if (key === "email") {
                if (!Utils.emailValidator(value)) {
                    errors.push(`${name} is invalid.`);
                }
            } else if (key === "contact_no") {
                if (!Utils.contactNoValidator(value)) {
                    errors.push(`${name} is invalid.`);
                }
            } else if (originalUrl.includes("/" + constants.MODULE_TYPE.ORDER + "/change-status") && key === "status") {
                if (!constants.ORDER_STATUS_LIST[(value || "").toUpperCase()]) {
                    errors.push(`${name} is invalid.`);
                }
            } else if (key === "password") {
                if (!Utils.passwordValidator(value)) {
                    errors.push(`${name} must contain at least 1 lowercase, uppercase, numeric, special and 8 characters longer.`);
                }
            }
        }

        if (errors.length) {
            res.json({
                statusCode: constants.FAILURE,
                message: "Bad Request",
                errors,
            });
        } else {
            next();
        }
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};
