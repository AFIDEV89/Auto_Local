"use strict";

/**
 * Adding address model
 */
export const LeadDataModel = (sequelize, Sequelize) => {
    const model = sequelize.define("leads", {
        customer_name: {
            type: Sequelize.STRING,
            allowNull: true,
            trim: true // Trim leading and trailing spaces
        },
        contact_no: {
            type: Sequelize.INTEGER,
            allowNull: false,
            trim: true // Trim leading and trailing spaces
        },
        product_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            trim: true // Trim leading and trailing spaces
        },
        feedback: {
            type: Sequelize.STRING,
            allowNull: true,
            trim: true // Trim leading and trailing spaces
        },
        status: {
            type: Sequelize.STRING,
            allowNull: true,
            trim: true // Trim leading and trailing spaces
        }
    });

    return model;
};
