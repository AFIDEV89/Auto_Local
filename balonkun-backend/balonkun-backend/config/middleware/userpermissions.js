import {USER_TYPE} from "../constants.js";

export function requireScope(scope) {
    return function (req, res, next) {
            let has_scopes = true
            if(USER_TYPE[req.body['user'].type] > USER_TYPE[scope] ) {
                has_scopes = false
            }
            if (!has_scopes) {
                return;
            }
            next();
    };toh
}