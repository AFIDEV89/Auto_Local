"use strict";

/**
 * Adding product variant model
 */
export const ProductVariantModel = (sequelize, Sequelize) => {
  const model = sequelize.define("product_variants", {
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    design_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    material_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    major_color_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  });

  return model;
};
