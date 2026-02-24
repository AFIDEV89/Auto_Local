"use strict";
import { API_POST_URLS, MODULE_TYPE } from '../../constants/index.js';
import { titleCase, getSwaggerPath } from '../../utils/index.js';

const security = [
    {
        api_key: [],
        Bearer: [],
        UserType: [],
    },
];

const userTypeSecurity = [
    {
        UserType: [],
    },
];

const UserLogin = {
    get: {
        tags: [titleCase(MODULE_TYPE.USER)],
        summary: "To login user",
        security: userTypeSecurity,
        parameters: [
            {
                name: "email",
                in: "query",
                description: "User email address",
            },
            {
                name: "password",
                in: "query",
                description: "User account password",
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/User",
                },
            },
        },
    },
};

const UserSignUp = {
    post: {
        tags: [titleCase(MODULE_TYPE.USER)],
        summary: "To sign-up user",
        parameters: [
            {
                name: "user",
                in: "body",
                description: "User that we want to create",
                schema: {
                    $ref: "#/definitions/User",
                },
            },
        ],
        responses: {
            201: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/User",
                },
            },
        },
    },
};

const UpdateUser = {
    patch: {
        tags: [titleCase(MODULE_TYPE.USER)],
        summary: "To update user details",
        security,
        parameters: [
            {
                name: "user",
                in: "body",
                description: "User that we want to update",
                schema: {
                    $ref: "#/definitions/UserUpdate",
                },
            },
        ],
        responses: {
            204: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/UpdateResponse",
                },
            },
        },
    },
};

const GetUserList = {
    get: {
        tags: [titleCase(MODULE_TYPE.USER)],
        summary: "To fetch user list",
        security,
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/User",
                },
            },
        },
    },
};

const VerifyUserEmail = {
    get: {
        tags: [titleCase(MODULE_TYPE.USER)],
        summary: "To verify user email",
        parameters: [
            {
                name: "token",
                in: "path",
                description: "User email verification token",
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/UpdateResponse",
                },
            },
        },
    },
};

const GetRefreshToken = {
    get: {
        tags: [titleCase(MODULE_TYPE.USER)],
        summary: "To get user refresh token",
        parameters: [
            {
                name: "id",
                in: "path",
                description: "User Id",
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/UpdateResponse",
                },
            },
        },
    },
};

const ResendVerifyUserEmail = {
    patch: {
        tags: [titleCase(MODULE_TYPE.USER)],
        summary: "To send email to verify user email",
        parameters: [
            {
                name: "email",
                in: "body",
                description: "Please enter your email address",
                schema: {
                    $ref: "#/definitions/SendUserEmailInvite",
                },
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/UpdateResponse",
                },
            },
        },
    },
};

const LogoutUser = {
    patch: {
        tags: [titleCase(MODULE_TYPE.USER)],
        summary: "To logout the user",
        security,
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/UpdateResponse",
                },
            },
        },
    },
};

const SendInviteToResetUserPassword = {
    patch: {
        tags: [titleCase(MODULE_TYPE.USER)],
        summary: "To send email invite to reset user password",
        parameters: [
            {
                name: "email",
                in: "body",
                description: "Please enter your email address",
                schema: {
                    $ref: "#/definitions/SendUserEmailInvite",
                },
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/UpdateResponse",
                },
            },
        },
    },
};

const ResetUserPassword = {
    patch: {
        tags: [titleCase(MODULE_TYPE.USER)],
        summary: "To reset user password",
        parameters: [
            {
                name: "reset password",
                in: "body",
                schema: {
                    $ref: "#/definitions/ResetUserPassword",
                },
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/UpdateResponse",
                },
            },
        },
    },
};

const ChangeUserPassword = {
    patch: {
        tags: [titleCase(MODULE_TYPE.USER)],
        summary: "To change user password",
        security,
        parameters: [
            {
                name: "change password",
                in: "body",
                schema: {
                    $ref: "#/definitions/ChangeUserPassword",
                },
            },
        ],
        responses: {
            200: {
                description: "Success",
                schema: {
                    $ref: "#/definitions/UpdateResponse",
                },
            },
        },
    },
};

export default {
    ['/' + MODULE_TYPE.USER + "/login"]: UserLogin,
    ['/' + MODULE_TYPE.USER + "/sign-up"]: UserSignUp,
    ['/' + MODULE_TYPE.USER + "/update"]: UpdateUser,
    ['/' + MODULE_TYPE.USER + "/get-list"]: GetUserList,
    ['/' + MODULE_TYPE.USER + getSwaggerPath("/verify-email/:token")]: VerifyUserEmail,
    ['/' + MODULE_TYPE.USER + getSwaggerPath('/refresh-token/:id')]: GetRefreshToken,
    ['/' + MODULE_TYPE.USER + "/resend-verify-email"]: ResendVerifyUserEmail,
    ['/' + MODULE_TYPE.USER + getSwaggerPath("/logout")]: LogoutUser,
    ['/' + MODULE_TYPE.USER + '/forgot-password']: SendInviteToResetUserPassword,
    ['/' + MODULE_TYPE.USER + '/reset-password']: ResetUserPassword,
    ['/' + MODULE_TYPE.USER + '/change-password']: ChangeUserPassword,
};
