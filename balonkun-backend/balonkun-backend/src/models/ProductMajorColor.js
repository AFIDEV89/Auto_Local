"use strict";

/**
 * Adding product major color model
 */
export const ProductMajorColorModel = (sequelize, Sequelize) => {
  const model = sequelize.define("product_major_color", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    color_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  });

  return model;
};
