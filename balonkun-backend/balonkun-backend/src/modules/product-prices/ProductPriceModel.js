"use strict";

/**
 * Adding product price model
 */
export const ProductPriceModel = (sequelize, Sequelize) => {
  const model = sequelize.define("product_prices", {
    design_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    vehicle_category_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    brand_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    base_price: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    design_price: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  });

  return model;
};
