"use strict";

/**
 * Adding review model
 */
export const ReviewModel = (sequelize, Sequelize) => {
    const model = sequelize.define("review", {
        product_id: {
            type: Sequelize.INTEGER,
        },
        name: {
            type: Sequelize.STRING,
        },
        image: {
            type: Sequelize.JSON,
        },
        description: {
            type: Sequelize.STRING,
        },
        rating: {
            type: Sequelize.DOUBLE,
        },
    });

    return model;
};
