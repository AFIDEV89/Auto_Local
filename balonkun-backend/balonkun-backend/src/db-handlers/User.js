"use strict";
import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const UserModel = db.users;

/**
 * @method CreateUser: To add new user
 * @param {Object} data user detail
 */
export const CreateUser = (data) => {
    try {
        return new Promise((resolve) => {
            UserModel.create(data)
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(false);
                    }
                })
                .catch((error) => {
                    let errMessage = error.message;
                    if (error.errors?.[0]?.type === 'unique violation') {
                        errMessage = 'You are already registered with this email address.';
                    }
                    resolve(errMessage);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method GetUser: To get existing user
 * @param {Object} data user detail
 */
export const GetUser = ({ cond, isPwdReq = false }) => {
    try {
        return new Promise((resolve) => {
            UserModel.findOne({
                where: cond,
                attributes: { exclude: isPwdReq ? [] : ["password"] },
            })
                .then((result) => {
                    if (result) {
                        resolve(JSON.parse(JSON.stringify(result)));
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.USER }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method UpdateUser: To update existing user
 * @param {Object} detail user detail
 */
export const UpdateUser = (detail) => {
    try {
        const { data, cond } = detail;
        return new Promise((resolve) => {
            UserModel.update(data, { where: cond })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.USER }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method GetUserList: To fetch users
 */
export const GetUserList = () => {
    try {
        return new Promise((resolve) => {
            UserModel.findAll(
                {
                    where: { type: "user" },
                    attributes: { exclude: ['password', 'login_session_token'] }
                }
            )
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.FETCHING, name: MODULE_TYPE.USER }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};
