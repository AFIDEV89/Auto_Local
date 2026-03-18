'use strict';
import * as constants from '../constants/index.js';
import * as DbHandler from '../db-handlers/index.js';
import {decode, getToken, verifyToken} from '../middlewares/Authentication.js';
import * as Utils from '../utils/index.js';
import config from '../../config.js';
import {sendMail} from "../services/index.js";
import * as Html from '../static/htmls/index.js';
import * as validations from '../common/joi.js';
import * as dao from "../database/dao/index.js";
import {userLogin, userUpdate, validateSchema} from "../validations/index.js";


/**
 * @method UserLogin: To login users
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const UserLogin = async (req, res) => {

    try {
        const {query, headers} = req;
        const {email, password} = query;
        const errors = validateSchema({data: query, schema: userLogin});
        if (errors) {
            return res.json({
                statusCode: constants.FAILURE,
                message: constants.BAD_REQUEST,
                errors
            });
        }
        const user = await DbHandler.GetUser({cond: {email}, isPwdReq: true});
        const userType = headers["user-type"];
        if (user.type !== userType) {
            return res.json({
                statusCode: constants.FAILURE,
                message: 'Invalid email or password',
            });
        }
        if (Utils.isObject(user)) {
            if (!user.is_verified) {
                return res.json({
                    statusCode: constants.FAILURE,
                    message: 'Please verify your email.',
                });
            }
            const isMatched = await Utils.comparePassword({
                hash: user.password,
                password,
            });

            if (!isMatched) {
                return res.json({
                    statusCode: constants.FAILURE,
                    message: 'Invalid email or password',
                });
            }

            const token = await getToken({data: {id: user.id}, type: constants.TOKEN_EXPIRY_TYPE.LOGIN});
            await DbHandler.UpdateUser({
                data: {login_session_token: token},
                cond: {id: user.id},
            });
            delete user.password;

            res.json({
                statusCode: constants.GET_SUCCESS,
                message: 'Login user successfully.',
                data: {...user, login_session_token: token},
            });
        } else {
            res.json({
                statusCode: constants.FAILURE,
                message: "Invalid email or password.",
            });
        }
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

/**
 * @method UserSignUp: To sign-up users
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const UserSignUp = async (req, res) => {
    try {
        let type = "user"
        const {first_name, last_name, mobile_no, email, password,is_phone_verified} = req.body;
        if (req.body.type)
            type = req.body.type
        const user = await DbHandler.CreateUser({
            first_name,
            last_name,
            mobile_no,
            email,
            password,
            type,
            is_phone_verified
        });
        if (user?.id) {
            const token = await getToken({data: {id: user.id}, type: constants.TOKEN_EXPIRY_TYPE.VERIFY_EMAIL});
            const isUpdated = await DbHandler.UpdateUser({
                cond: {id: user.id},
                data: {verify_email_token: token},
            });
            if (isUpdated) {
                const link = `${config.WEB_URL}/verify-email/${token}`;
                sendMail({
                    to: email,
                    subject: 'Verify Email',
                    html: Html.UserVerifyEmail(link),
                });
                return res.json({
                    statusCode: constants.CREATION_SUCCESS,
                    message: constants.SENT_EMAIL_SUCCESS,
                });
            }
        }
        res.json({
            statusCode: constants.FAILURE,
            message: user,
        });
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

/**
 * @method UpdateUser: To update existing user
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const UpdateUser = async (req, res) => {
    try {
        const {user, body} = req;
        const errors = validateSchema({data: body, schema: userUpdate});
        if (errors) {
            return res.json({
                statusCode: constants.FAILURE,
                message: constants.BAD_REQUEST,
                errors
            });
        }
        let id = ""
        if(user)
        id = user.id;
        if(body.id) {
            id = body.id
        }else if(body.password){
            return res.json({
                statusCode: constants.FAILURE,
                message: "Password Not Allowed",
                errors
            });
        }else if(body.type) {
            return res.json({
                statusCode: constants.FAILURE,
                message: "Can't update type of user",
                errors
            });
        }
        const detail = await DbHandler.UpdateUser({
            cond: {id},
            data: body,
        });
        if (detail === true) {
            res.json({
                statusCode: constants.UPDATE_SUCCESS,
                message: 'User updated successfully.',
            });
        } else {
            res.json({
                statusCode: constants.FAILURE,
                message: constants.BAD_REQUEST,
            });
        }
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

/**
 * @method GetUserList: To get user list
 * @param {Object} req request object
 * @param {Object} res response object
 */
export function get_user_list(req, res) {
    let page = req.query.page;
    let limit = req.query.limit;

    return validations.validateSchema(
        req,
        res,
        validations.validations.pagination,
        () => dao.getRows({
            tableName: "users",
            attributes: {exclude: ['password', 'login_session_token']},
            page,
            limit,
        }),
        constants.GET_SUCCESS,
        ""
    );
};

/**
 * @method VerifyUserEmail: To verify user email address
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const VerifyUserEmail = async (req, res) => {
    try {
        const errors = validateSchema({data: req.params, schema: validations.verifyUserEmail});
        if (errors) {
            return res.json({
                statusCode: constants.FAILURE,
                message: constants.BAD_REQUEST,
                errors
            });
        }
        const {token} = req.params;
        const user = await DbHandler.GetUser({cond: {verify_email_token: token}});
        if (Utils.isObject(user) && user.id) {
            if (user.is_verified) {
                return res.json({
                    statusCode: constants.CONFLICT,
                    message: constants.ALREADY_VERIFIED,
                });
            }
            const isValid = await verifyToken(token);
            if (!isValid) {
                return res.json({
                    statusCode: constants.FAILURE,
                    message: constants.LINK_EXPIRED,
                });
            }
            const isUpdated = await DbHandler.UpdateUser({
                cond: {id: user.id},
                data: {is_verified: true},
            });
            if (isUpdated) {
                return res.json({
                    statusCode: constants.UPDATE_SUCCESS,
                    message: 'Your email has been verified.',
                });
            }
        }
        res.json({
            statusCode: constants.FAILURE,
            message: 'Invalid link.',
        });
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

/**
 * @method GetRefrehToken: To get user refresh token
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const GetRefrehToken = async (req, res) => {
    try {
        const errors = validateSchema({data: req.params, schema: validations.getUserRefrehToken});
        if (errors) {
            return res.json({
                statusCode: constants.FAILURE,
                message: constants.BAD_REQUEST,
                errors
            });
        }
        const user = await DbHandler.GetUser({data: {id: req.params.id}});
        if (Utils.isObject(user) && user.id) {
            const refrehToken = await getToken({data: {id: user.id}});
            await DbHandler.UpdateUser({
                data: {login_session_token: refrehToken},
                cond: {id: user.id},
            });
            res.json({
                statusCode: constants.GET_SUCCESS,
                message: 'Get user refresh token successfully.',
                data: {...user, login_session_token: refrehToken}
            });
        } else {
            res.json({
                statusCode: constants.GET_SUCCESS,
                message: 'Invalid Id.'
            });
        }
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

/**
 * @method ResendVerifyUserEmail: To resend email for user email verification
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const ResendVerifyUserEmail = async (req, res) => {
    try {
        const {token} = req.body;
        const payload = decode(token)
        // const errors = validateSchema({data: req.body, schema: validations.email});
        // if (errors) {
        //     return res.json({
        //         statusCode: constants.FAILURE,
        //         message: constants.BAD_REQUEST,
        //         errors
        //     });
        // }
        const user = await DbHandler.GetUser({cond: {id:payload.id}});
        if (Utils.isObject(user) && user.id) {
            if (user.is_verified) {
                return res.json({
                    statusCode: constants.CONFLICT,
                    message: constants.ALREADY_VERIFIED,
                });
            }
            const token = await getToken({data: {id: user.id}, type: constants.TOKEN_EXPIRY_TYPE.VERIFY_EMAIL});
            const isUpdated = await DbHandler.UpdateUser({
                cond: {id: user.id},
                data: {verify_email_token: token},
            });
            if (isUpdated) {
                const link = `${config.WEB_URL}/verify-email/${token}`;
                sendMail({
                    to: user.email,
                    subject: 'Verify Email',
                    html: Html.UserVerifyEmail(link),
                });
                return res.json({
                    statusCode: constants.GET_SUCCESS,
                    message: constants.SENT_EMAIL_SUCCESS,
                });
            }
        } else {
            return res.json({
                statusCode: constants.FAILURE,
                message: constants.NOT_REGISTERED,
            });
        }
        res.json({
            statusCode: constants.FAILURE,
            message: user,
        });
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

/**
 * @method LogoutUser: To logout the user
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const LogoutUser = async (req, res) => {
    try {
        const isUpdated = await DbHandler.UpdateUser({
            cond: {id: req.user.id},
            data: {login_session_token: null},
        });
        if (isUpdated) {
            return res.json({
                statusCode: constants.UPDATE_SUCCESS,
                message: constants.LOGOUT
            });
        }
        res.json({
            statusCode: constants.FAILURE,
            message: constants.FAILED
        });
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

/**
 * @method SendInviteToResetPassword: To send email invite to reset user password
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const SendInviteToResetPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const errors = validateSchema({data: req.body, schema: validations.email});
        if (errors) {
            return res.json({
                statusCode: constants.FAILURE,
                message: constants.BAD_REQUEST,
                errors
            });
        }
        const user = await DbHandler.GetUser({cond: {email}});
        if (Utils.isObject(user) && user.id) {
            const token = await getToken({data: {id: user.id}, type: constants.TOKEN_EXPIRY_TYPE.FORGOT_PASSWORD});
            const isUpdated = await DbHandler.UpdateUser({
                cond: {id: user.id},
                data: {forgot_password_token: token},
            });
            if (isUpdated) {
                const link = `${config.WEB_URL}/reset-password/${token}`;
                sendMail({
                    to: email,
                    subject: 'Reset Password',
                    html: Html.UserForgotPassword(link),
                });
                return res.json({
                    statusCode: constants.GET_SUCCESS,
                    message: constants.SENT_EMAIL_SUCCESS,
                });
            }
        } else {
            return res.json({
                statusCode: constants.FAILURE,
                message: constants.NOT_REGISTERED,
            });
        }
        res.json({
            statusCode: constants.FAILURE,
            message: user,
        });
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

/**
 * @method ResetUserPassword: To reset user password
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const ResetUserPassword = async (req, res) => {
    try {
        const {token, password} = req.body;
        const errors = validateSchema({data: req.body, schema: validations.ResetUserPassword});
        if (errors) {
            return res.json({
                statusCode: constants.FAILURE,
                message: constants.BAD_REQUEST,
                errors
            });
        }
        const isValid = verifyToken(token);
        if (isValid?.id) {
            const user = await DbHandler.GetUser({cond: {forgot_password_token: token}, isPwdReq: true});
            if (Utils.isObject(user) && user.id) {
                const hash = await Utils.getHash(password);
                const isUpdated = await DbHandler.UpdateUser({
                    cond: {id: user.id},
                    data: {password: hash, forgot_password_token: null},
                });
                if (isUpdated) {
                    return res.json({
                        statusCode: constants.UPDATE_SUCCESS,
                        message: "User password has been reset successfully.",
                    });
                }
            }
        }
        res.json({
            statusCode: constants.FAILURE,
            message: constants.LINK_EXPIRED,
        });
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};

/**
 * @method ChangeUserPassword: To change user password
 * @param {Object} req request object
 * @param {Object} res response object
 */
export const ChangeUserPassword = async (req, res) => {
    try {
        const {current_password, new_password} = req.body;
        const errors = validateSchema({data: req.body, schema: validations.ChangeUserPassword});
        if (errors) {
            return res.json({
                statusCode: constants.FAILURE,
                message: constants.BAD_REQUEST,
                errors
            });
        }
        const isMatched = await Utils.comparePassword({
            hash: req.user.password,
            password: current_password,
        });
        if (!isMatched) {
            return res.json({
                statusCode: constants.FAILURE,
                message: 'Invalid current password',
            });
        }
        const hash = await Utils.getHash(new_password);
        const isUpdated = await DbHandler.UpdateUser({
            cond: {id: req.user.id},
            data: {password: hash},
        });
        if (isUpdated) {
            return res.json({
                statusCode: constants.UPDATE_SUCCESS,
                message: "User password has been changed successfully.",
            });
        }
        res.json({
            statusCode: constants.FAILURE,
            message: constants.BAD_REQUEST,
            errors
        });
    } catch (error) {
        res.json({
            statusCode: constants.SERVER_CRASH,
            message: error.message || error,
        });
    }
};
