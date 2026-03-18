"use strict";

/**
 * Adding order product model
 */
export const OrderProductModel = (sequelize, Sequelize) => {
    const model = sequelize.define("order_product", {
        order_id: {
            type: Sequelize.INTEGER,
        },
        product_id: {
            type: Sequelize.INTEGER,
        },
        quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
        amount_per_product: {
            type: Sequelize.INTEGER,
        },
        total_amount: {
            type: Sequelize.INTEGER,
        },
    });

    return model;
};
