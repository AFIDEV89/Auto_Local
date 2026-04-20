"use strict";

export const PopLeadModel = (sequelize, Sequelize) => {
    const model = sequelize.define("pop_leads", {
        customer_name: {
            type: Sequelize.STRING,
            allowNull: true,
            trim: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            trim: true
        },
        contact_no: {
            type: Sequelize.STRING,
            allowNull: true,
            trim: true
        },
        feedback: {
            type: Sequelize.STRING,
            allowNull: true,
            trim: true
        },
        status: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: "new_lead",
            trim: true
        }
    });

    return model;
};
