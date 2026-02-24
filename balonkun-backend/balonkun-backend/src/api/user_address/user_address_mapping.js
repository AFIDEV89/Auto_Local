"use strict";

/**
 * Adding address model
 */
export const UserAddressModel = (sequelize, Sequelize) => {
    const model = sequelize.define("user_addresses", {
        street_address: {
            type: Sequelize.STRING,
            allowNull: false,
            trim: true // Trim leading and trailing spaces
        },
        city: {
            type: Sequelize.STRING,
            allowNull: true,
            trim: true // Trim leading and trailing spaces
        },
        state: {
            type: Sequelize.STRING,
            allowNull: true,
            trim: true // Trim leading and trailing spaces
        },
        postal_code: {
            type: Sequelize.STRING,
            allowNull: true,
            trim: true // Trim leading and trailing spaces
        },
        country: {
            type: Sequelize.STRING,
            allowNull: true,
            trim: true // Trim leading and trailing spaces
        }, user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            trim: true // Trim leading and trailing spaces
        }
    });

    return model;
};
