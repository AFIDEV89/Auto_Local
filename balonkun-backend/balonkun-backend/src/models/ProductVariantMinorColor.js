"use strict";

/**
 * Adding product minor color model
 */
export const ProductVariantMinorColorModel = (sequelize, Sequelize) => {
  const model = sequelize.define("product_variant_minor_color", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_variant_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    minor_color_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return model;
};
