"use strict";

/**
 * Adding product material model
 */
export const ProductMaterialModel = (sequelize, Sequelize) => {
  const model = sequelize.define("product_material", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    material_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  });

  return model;
};
