"use strict";
import jwt from "jsonwebtoken";

import * as constants from "../constants/index.js";
import * as DbHandler from "../db-handlers/index.js";
import * as Utils from "../utils/index.js";
import config from "../../config.js";

const { JWT_TOKEN_SECRET_KEY, LOGIN_TOKEN_EXPIRY, API_KEY, VERIFY_EMAIL_TOKEN_EXPIRY, API_BASE_URL, FORGOT_PASSWORD_TOKEN_EXPIRY } = config;

const isPublicRoute = ({ userType, apiUrl }) => {
    try {
        if (userType === constants.USER_TYPE.ADMIN) {
            return !!constants.AdminPublicRoutes.find(route => apiUrl.startsWith(API_BASE_URL + route));
        }
        // Default to USER logic for undefined/guest user types
        return !constants.WebPrivateRoutes.find(route => apiUrl.startsWith(API_BASE_URL + route));
    } catch (error) {
        return false;
    }
};

export const Authenticator = async (req, res, next) => {
    try {
        const { headers, originalUrl } = req;
        const apiUrl = Utils.paramRemover(originalUrl);
        const id = originalUrl.split('/').pop();
        const isValidId = Number.isInteger(parseInt(id));
        const userType = headers["user-type"];
        const isPublic = isPublicRoute({ userType, apiUrl: isValidId ? apiUrl.replace("/" + id, "/:id") : apiUrl });

        if (isPublic) {
            return next();
        } else {
            const bearerToken = headers["authorization"];
            const apiKey = headers["api-key"];

            if (bearerToken && apiKey === API_KEY) {
                const isBearerToken = bearerToken.startsWith("Bearer");
                if (isBearerToken) {
                    const token = bearerToken.slice(7);
                    if (token) {
                        const isValid = verifyToken(token);
                        if (isValid?.id) {
                            const user = await DbHandler.GetUser({
                                cond: { id: isValid.id }, isPwdReq: true
                            });
                            if (userType === user.type && Utils.isObject(user)/* && user.login_session_token === token*/) {
                                req.user = user;
                                return next();
                            }
                        }
                    }
                }
            }
        }
        res.json({ statusCode: constants.EXPIRED_SESSION, error: "You are not authorized to access api's." });
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

const getExpiry = (type) => {
    try {
        switch (type) {
            case constants.TOKEN_EXPIRY_TYPE.LOGIN:
                return LOGIN_TOKEN_EXPIRY;
            case constants.TOKEN_EXPIRY_TYPE.VERIFY_EMAIL:
                return VERIFY_EMAIL_TOKEN_EXPIRY;
            case constants.TOKEN_EXPIRY_TYPE.FORGOT_PASSWORD:
                return FORGOT_PASSWORD_TOKEN_EXPIRY;
            default:
                return LOGIN_TOKEN_EXPIRY;
        }
    } catch (error) {
        return LOGIN_TOKEN_EXPIRY;
    }
};

export const getToken = async ({ data, type }) => {
    try {
        return await jwt.sign(data, JWT_TOKEN_SECRET_KEY, {
            expiresIn: getExpiry(type),
        });
    } catch (error) {
        return error.message || error;
    }
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                return false;
            } else {
                return decoded;
            }
        });
    } catch (error) {
        return false;
    }
};


export const decode = (token) => {
    try {
        return jwt.decode(token, JWT_TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                return false;
            } else {
                return decoded;
            }
        });
    } catch (error) {
        return false;
    }
};