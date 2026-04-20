"use strict";

/**
 * Model for tracking products allowed for direct online sale (E-commerce)
 */
export const SelectiveShopModel = (sequelize, Sequelize) => {
    const model = sequelize.define("ecommerce_shop_registry", {
        product_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            references: {
                model: 'products',
                key: 'id'
            }
        }
    }, {
        tableName: 'ecommerce_shop_registry',
        timestamps: true,
        underscored: true
    });

    return model;
};
