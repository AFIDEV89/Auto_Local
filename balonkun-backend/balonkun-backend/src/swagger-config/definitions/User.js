"use strict";

const User = {
    required: ["first_name", "last_name", "email", "password"],
    properties: {
        id: {
            type: "integer",
        },
        first_name: {
            type: "string",
        },
        last_name: {
            type: "string",
        },
        email: {
            type: "string",
        },
        password: {
            type: "string",
        },
    },
};

const UserUpdate = {
    properties: {
        first_name: {
            type: "string",
        },
        last_name: {
            type: "string",
        },
        vehicle_type_id: {
            type: "integer",
        },
    },
};

const SendUserEmailInvite = {
    properties: {
        email: {
            type: 'string',
        },
    }
};

const ResetUserPassword = {
    properties: {
        token: {
            type: 'string',
        },
        password: {
            type: 'string',
        },
    }
};

const ChangeUserPassword = {
    properties: {
        current_password: {
            type: 'string',
        },
        new_password: {
            type: 'string',
        },
    }
};

export default {
    User, UserUpdate, SendUserEmailInvite, ResetUserPassword, ChangeUserPassword
};
