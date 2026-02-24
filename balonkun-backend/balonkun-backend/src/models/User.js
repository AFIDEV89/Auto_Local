"use strict";
import * as constants from "../constants/index.js";
import { getHash } from "../utils/index.js";

/**
 * Adding user model
 */
export const UserModel = (sequelize, Sequelize) => {
    const model = sequelize.define(
        "user",
        {
            first_name: {
                type: Sequelize.STRING,
            },
            last_name: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.ENUM("active", "inactive", "block"),
                defaultValue: "active",
            },
            login_session_token: {
                type: Sequelize.TEXT,
            },
            type: {
                type: Sequelize.ENUM(...Object.values(constants.USER_TYPE)),
                defaultValue: constants.USER_TYPE.USER
            },
            is_verified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            verify_email_token: {
                type: Sequelize.TEXT,
            },
            forgot_password_token: {
                type: Sequelize.TEXT,
            },
            vehicle_type_id: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            vehicle_brand_id: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            vehicle_brand_model_id: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            mobile_no: {
                type: Sequelize.STRING,
                defaultValue: "",
            },
            is_phone_verified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        const hash = await getHash(user.password);
                        user.password = hash;
                    }
                },
            },
        }
    );

    return model;
};
