"use strict";

/**
 * Adding products to cart model
 */
export const CartProductModel = (sequelize, Sequelize) => {
    const model = sequelize.define("cart_product", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            unique: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        product_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
    });

    return model;
};
